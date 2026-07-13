import asyncHandler from 'express-async-handler';
import { User } from '../models/User.js';
import { Campaign } from '../models/Campaign.js';
import { Contribution } from '../models/Contribution.js';
import { Payment } from '../models/Payment.js';

export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
  res.json(users);
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!['supporter', 'creator', 'admin'].includes(role)) {
    res.status(400);
    throw new Error('Role must be supporter, creator, or admin');
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.role = role;
  await user.save();
  res.json({ id: user._id, role: user.role });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  await user.deleteOne();
  res.json({ message: 'User removed' });
});

export const getAdminStats = asyncHandler(async (req, res) => {
  const [totalSupporters, totalCreators, creditsAgg, paymentsAgg] = await Promise.all([
    User.countDocuments({ role: 'supporter' }),
    User.countDocuments({ role: 'creator' }),
    User.aggregate([{ $group: { _id: null, total: { $sum: '$credits' } } }]),
    Payment.countDocuments(),
  ]);

  res.json({
    totalSupporters,
    totalCreators,
    totalAvailableCredits: creditsAgg[0]?.total || 0,
    totalPaymentsProcessed: paymentsAgg,
  });
});

export const getCreatorStats = asyncHandler(async (req, res) => {
  const campaigns = await Campaign.find({ creatorEmail: req.user.email });
  const totalCampaigns = campaigns.length;
  const activeCampaigns = campaigns.filter((c) => new Date(c.deadline) >= new Date()).length;
  const totalAmountRaised = campaigns.reduce((sum, c) => sum + c.amountRaised, 0);

  res.json({ totalCampaigns, activeCampaigns, totalAmountRaised });
});

export const getSupporterStats = asyncHandler(async (req, res) => {
  const [totalContributions, totalPending, approvedAgg] = await Promise.all([
    Contribution.countDocuments({ supporterEmail: req.user.email }),
    Contribution.countDocuments({ supporterEmail: req.user.email, status: 'pending' }),
    Contribution.aggregate([
      { $match: { supporterEmail: req.user.email, status: 'approved' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
  ]);

  res.json({
    totalContributions,
    totalPendingContributions: totalPending,
    totalAmountContributed: approvedAgg[0]?.total || 0,
  });
});

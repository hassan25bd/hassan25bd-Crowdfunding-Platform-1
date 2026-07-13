import asyncHandler from 'express-async-handler';
import { Contribution } from '../models/Contribution.js';
import { Campaign } from '../models/Campaign.js';
import { User } from '../models/User.js';
import { notify } from '../utils/notify.js';

export const createContribution = asyncHandler(async (req, res) => {
  const { campaignId, amount, message } = req.body;

  if (!campaignId || !amount) {
    res.status(400);
    throw new Error('campaignId and amount are required');
  }

  const campaign = await Campaign.findById(campaignId);
  if (!campaign || campaign.status !== 'approved') {
    res.status(404);
    throw new Error('Campaign not found or not accepting contributions');
  }
  if (new Date(campaign.deadline) < new Date()) {
    res.status(400);
    throw new Error('This campaign is no longer accepting contributions');
  }
  if (amount < campaign.minimumContribution) {
    res.status(400);
    throw new Error(`Minimum contribution for this campaign is ${campaign.minimumContribution} credits`);
  }

  const supporter = await User.findById(req.user._id);
  if (supporter.credits < amount) {
    res.status(400);
    throw new Error('Insufficient credits');
  }

  supporter.credits -= amount;
  await supporter.save();

  const contribution = await Contribution.create({
    campaignId: campaign._id,
    campaignTitle: campaign.title,
    amount,
    message: message || '',
    supporterEmail: supporter.email,
    supporterName: supporter.name,
    creatorEmail: campaign.creatorEmail,
    creatorName: campaign.creatorName,
    status: 'pending',
  });

  await notify({
    message: `${supporter.name} contributed ${amount} credits to "${campaign.title}". Review it now.`,
    toEmail: campaign.creatorEmail,
    actionRoute: '/dashboard/my-campaigns',
  });

  res.status(201).json(contribution);
});

export const getMyContributions = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);

  const filter = { supporterEmail: req.user.email };
  const [contributions, total] = await Promise.all([
    Contribution.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Contribution.countDocuments(filter),
  ]);

  res.json({
    contributions,
    page,
    totalPages: Math.ceil(total / limit),
    total,
  });
});

export const getPendingContributionsForCreator = asyncHandler(async (req, res) => {
  const contributions = await Contribution.find({
    creatorEmail: req.user.email,
    status: 'pending',
  }).sort({ createdAt: 1 });
  res.json(contributions);
});

export const approveContribution = asyncHandler(async (req, res) => {
  const contribution = await Contribution.findById(req.params.id);
  if (!contribution) {
    res.status(404);
    throw new Error('Contribution not found');
  }
  if (contribution.creatorEmail !== req.user.email) {
    res.status(403);
    throw new Error('You can only review contributions to your own campaigns');
  }
  if (contribution.status !== 'pending') {
    res.status(400);
    throw new Error('This contribution has already been reviewed');
  }

  contribution.status = 'approved';
  await contribution.save();

  await Campaign.updateOne(
    { _id: contribution.campaignId },
    { $inc: { amountRaised: contribution.amount } }
  );

  await notify({
    message: `Your contribution of ${contribution.amount} credits to "${contribution.campaignTitle}" was approved by ${contribution.creatorName}.`,
    toEmail: contribution.supporterEmail,
    actionRoute: '/dashboard/my-contributions',
  });

  res.json(contribution);
});

export const rejectContribution = asyncHandler(async (req, res) => {
  const contribution = await Contribution.findById(req.params.id);
  if (!contribution) {
    res.status(404);
    throw new Error('Contribution not found');
  }
  if (contribution.creatorEmail !== req.user.email) {
    res.status(403);
    throw new Error('You can only review contributions to your own campaigns');
  }
  if (contribution.status !== 'pending') {
    res.status(400);
    throw new Error('This contribution has already been reviewed');
  }

  contribution.status = 'rejected';
  await contribution.save();

  await User.updateOne(
    { email: contribution.supporterEmail },
    { $inc: { credits: contribution.amount } }
  );

  await notify({
    message: `Your contribution of ${contribution.amount} credits to "${contribution.campaignTitle}" was rejected and refunded.`,
    toEmail: contribution.supporterEmail,
    actionRoute: '/dashboard/my-contributions',
  });

  res.json(contribution);
});

import asyncHandler from 'express-async-handler';
import { Campaign } from '../models/Campaign.js';
import { notify } from '../utils/notify.js';
import { refundApprovedContributions } from '../utils/refundContributions.js';

export const getCampaigns = asyncHandler(async (req, res) => {
  const { category, search } = req.query;
  const filter = { status: 'approved', deadline: { $gte: new Date() } };

  if (category) filter.category = category;
  if (search) filter.title = { $regex: search, $options: 'i' };

  const campaigns = await Campaign.find(filter).sort({ deadline: 1 });
  res.json(campaigns);
});

export const getTopFundedCampaigns = asyncHandler(async (req, res) => {
  const campaigns = await Campaign.find({ status: 'approved' })
    .sort({ amountRaised: -1 })
    .limit(6);
  res.json(campaigns);
});

export const getCampaignById = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);
  if (!campaign) {
    res.status(404);
    throw new Error('Campaign not found');
  }
  res.json(campaign);
});

export const getMyCampaigns = asyncHandler(async (req, res) => {
  const campaigns = await Campaign.find({ creatorEmail: req.user.email }).sort({ deadline: -1 });
  res.json(campaigns);
});

export const createCampaign = asyncHandler(async (req, res) => {
  const { title, story, category, fundingGoal, minimumContribution, deadline, rewardInfo, imageUrl } =
    req.body;

  if (!title || !story || !category || !fundingGoal || !minimumContribution || !deadline || !imageUrl) {
    res.status(400);
    throw new Error('Missing required campaign fields');
  }
  if (new Date(deadline) <= new Date()) {
    res.status(400);
    throw new Error('Deadline must be in the future');
  }
  if (minimumContribution > fundingGoal) {
    res.status(400);
    throw new Error('Minimum contribution cannot exceed the funding goal');
  }

  const campaign = await Campaign.create({
    creatorEmail: req.user.email,
    creatorName: req.user.name,
    title,
    story,
    category,
    fundingGoal,
    minimumContribution,
    deadline,
    rewardInfo,
    imageUrl,
    status: 'pending',
  });

  res.status(201).json(campaign);
});

export const updateCampaign = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);
  if (!campaign) {
    res.status(404);
    throw new Error('Campaign not found');
  }
  if (campaign.creatorEmail !== req.user.email) {
    res.status(403);
    throw new Error('You can only update your own campaigns');
  }

  const { title, story, rewardInfo } = req.body;
  if (title !== undefined) campaign.title = title;
  if (story !== undefined) campaign.story = story;
  if (rewardInfo !== undefined) campaign.rewardInfo = rewardInfo;

  await campaign.save();
  res.json(campaign);
});

export const getPendingCampaigns = asyncHandler(async (req, res) => {
  const campaigns = await Campaign.find({ status: 'pending' }).sort({ createdAt: 1 });
  res.json(campaigns);
});

export const updateCampaignStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!['approved', 'rejected', 'suspended'].includes(status)) {
    res.status(400);
    throw new Error('Status must be approved, rejected, or suspended');
  }

  const campaign = await Campaign.findById(req.params.id);
  if (!campaign) {
    res.status(404);
    throw new Error('Campaign not found');
  }

  campaign.status = status;
  await campaign.save();

  const messages = {
    approved: `Your campaign "${campaign.title}" was approved and is now live.`,
    rejected: `Your campaign "${campaign.title}" was rejected by the admin.`,
    suspended: `Your campaign "${campaign.title}" was suspended by the admin.`,
  };
  await notify({
    message: messages[status],
    toEmail: campaign.creatorEmail,
    actionRoute: '/dashboard/my-campaigns',
  });

  res.json(campaign);
});

export const deleteCampaign = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);
  if (!campaign) {
    res.status(404);
    throw new Error('Campaign not found');
  }
  if (campaign.creatorEmail !== req.user.email) {
    res.status(403);
    throw new Error('You can only delete your own campaigns');
  }

  await refundApprovedContributions(campaign._id);
  await campaign.deleteOne();
  res.json({ message: 'Campaign deleted' });
});

export const adminDeleteCampaign = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);
  if (!campaign) {
    res.status(404);
    throw new Error('Campaign not found');
  }

  await refundApprovedContributions(campaign._id);
  await campaign.deleteOne();
  res.json({ message: 'Campaign deleted' });
});

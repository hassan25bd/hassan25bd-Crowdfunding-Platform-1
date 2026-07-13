import asyncHandler from 'express-async-handler';
import { Report } from '../models/Report.js';
import { Campaign } from '../models/Campaign.js';
import { refundApprovedContributions } from '../utils/refundContributions.js';

export const createReport = asyncHandler(async (req, res) => {
  const { campaignId, reason } = req.body;
  if (!campaignId || !reason) {
    res.status(400);
    throw new Error('campaignId and reason are required');
  }

  const campaign = await Campaign.findById(campaignId);
  if (!campaign) {
    res.status(404);
    throw new Error('Campaign not found');
  }

  const report = await Report.create({
    campaignId: campaign._id,
    campaignTitle: campaign.title,
    reporterEmail: req.user.email,
    reporterName: req.user.name,
    reason,
  });

  res.status(201).json(report);
});

export const getReports = asyncHandler(async (req, res) => {
  const reports = await Report.find().sort({ createdAt: -1 });
  res.json(reports);
});

export const resolveReport = asyncHandler(async (req, res) => {
  const { action } = req.body;
  if (!['suspend', 'delete', 'dismiss'].includes(action)) {
    res.status(400);
    throw new Error('action must be suspend, delete, or dismiss');
  }

  const report = await Report.findById(req.params.id);
  if (!report) {
    res.status(404);
    throw new Error('Report not found');
  }

  if (action === 'suspend') {
    await Campaign.updateOne({ _id: report.campaignId }, { $set: { status: 'suspended' } });
  } else if (action === 'delete') {
    await refundApprovedContributions(report.campaignId);
    await Campaign.deleteOne({ _id: report.campaignId });
  }

  report.status = 'resolved';
  await report.save();

  res.json(report);
});

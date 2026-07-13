import asyncHandler from 'express-async-handler';
import { Withdrawal } from '../models/Withdrawal.js';
import { Campaign } from '../models/Campaign.js';
import { notify } from '../utils/notify.js';
import { CREDITS_PER_DOLLAR, MIN_WITHDRAWAL_CREDITS } from '../utils/constants.js';

const getAvailableCredits = async (creatorEmail) => {
  const [raisedAgg] = await Campaign.aggregate([
    { $match: { creatorEmail } },
    { $group: { _id: null, total: { $sum: '$amountRaised' } } },
  ]);
  const [withdrawnAgg] = await Withdrawal.aggregate([
    { $match: { creatorEmail, status: { $in: ['pending', 'approved'] } } },
    { $group: { _id: null, total: { $sum: '$withdrawalCredit' } } },
  ]);

  const totalRaised = raisedAgg?.total || 0;
  const totalWithdrawnOrPending = withdrawnAgg?.total || 0;
  return { totalRaised, totalWithdrawnOrPending, available: totalRaised - totalWithdrawnOrPending };
};

export const getWithdrawalSummary = asyncHandler(async (req, res) => {
  const { totalRaised, totalWithdrawnOrPending, available } = await getAvailableCredits(req.user.email);
  res.json({
    totalRaisedCredits: totalRaised,
    reservedCredits: totalWithdrawnOrPending,
    availableCredits: available,
    availableUsd: available / CREDITS_PER_DOLLAR,
    minWithdrawalCredits: MIN_WITHDRAWAL_CREDITS,
    creditsPerDollar: CREDITS_PER_DOLLAR,
  });
});

export const createWithdrawal = asyncHandler(async (req, res) => {
  const { creditsToWithdraw, paymentSystem, accountNumber } = req.body;

  if (!creditsToWithdraw || !paymentSystem || !accountNumber) {
    res.status(400);
    throw new Error('creditsToWithdraw, paymentSystem, and accountNumber are required');
  }
  if (creditsToWithdraw < MIN_WITHDRAWAL_CREDITS) {
    res.status(400);
    throw new Error(`Minimum withdrawal is ${MIN_WITHDRAWAL_CREDITS} credits`);
  }

  const { available } = await getAvailableCredits(req.user.email);
  if (creditsToWithdraw > available) {
    res.status(400);
    throw new Error('Insufficient credit');
  }

  const withdrawal = await Withdrawal.create({
    creatorEmail: req.user.email,
    creatorName: req.user.name,
    withdrawalCredit: creditsToWithdraw,
    withdrawalAmount: creditsToWithdraw / CREDITS_PER_DOLLAR,
    paymentSystem,
    accountNumber,
    status: 'pending',
  });

  res.status(201).json(withdrawal);
});

export const getMyWithdrawals = asyncHandler(async (req, res) => {
  const withdrawals = await Withdrawal.find({ creatorEmail: req.user.email }).sort({ createdAt: -1 });
  res.json(withdrawals);
});

export const getPendingWithdrawals = asyncHandler(async (req, res) => {
  const withdrawals = await Withdrawal.find({ status: 'pending' }).sort({ createdAt: 1 });
  res.json(withdrawals);
});

export const approveWithdrawal = asyncHandler(async (req, res) => {
  const withdrawal = await Withdrawal.findById(req.params.id);
  if (!withdrawal) {
    res.status(404);
    throw new Error('Withdrawal request not found');
  }
  if (withdrawal.status !== 'pending') {
    res.status(400);
    throw new Error('This withdrawal has already been processed');
  }

  withdrawal.status = 'approved';
  await withdrawal.save();

  await notify({
    message: `Your withdrawal of ${withdrawal.withdrawalCredit} credits ($${withdrawal.withdrawalAmount}) was paid out via ${withdrawal.paymentSystem}.`,
    toEmail: withdrawal.creatorEmail,
    actionRoute: '/dashboard/payment-history',
  });

  res.json(withdrawal);
});

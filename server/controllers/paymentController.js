import asyncHandler from 'express-async-handler';
import Stripe from 'stripe';
import crypto from 'crypto';
import { Payment } from '../models/Payment.js';
import { User } from '../models/User.js';
import { CREDIT_PACKAGES } from '../utils/constants.js';

const stripeKey = process.env.STRIPE_SECRET_KEY;
const isStripeConfigured = Boolean(stripeKey) && stripeKey.length > 30;
const stripe = isStripeConfigured ? new Stripe(stripeKey) : null;

const findPackage = (credits) => CREDIT_PACKAGES.find((p) => p.credits === Number(credits));

export const getCreditPackages = asyncHandler(async (req, res) => {
  res.json(CREDIT_PACKAGES);
});

export const createPaymentIntent = asyncHandler(async (req, res) => {
  const pkg = findPackage(req.body.credits);
  if (!pkg) {
    res.status(400);
    throw new Error('Invalid credit package selected');
  }
  if (!stripe) {
    res.status(503);
    throw new Error('Stripe is not configured on this server');
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(pkg.priceUsd * 100),
    currency: 'usd',
    metadata: { credits: String(pkg.credits), supporterEmail: req.user.email },
  });

  res.json({ clientSecret: paymentIntent.client_secret });
});

export const confirmStripePayment = asyncHandler(async (req, res) => {
  const { paymentIntentId } = req.body;
  if (!paymentIntentId || !stripe) {
    res.status(400);
    throw new Error('paymentIntentId is required');
  }

  const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
  if (intent.status !== 'succeeded') {
    res.status(400);
    throw new Error('Payment has not succeeded yet');
  }
  if (intent.metadata.supporterEmail !== req.user.email) {
    res.status(403);
    throw new Error('This payment does not belong to you');
  }

  const existing = await Payment.findOne({ transactionId: paymentIntentId });
  if (existing) {
    return res.json(existing);
  }

  const credits = Number(intent.metadata.credits);
  const amountUsd = intent.amount / 100;

  await User.updateOne({ email: req.user.email }, { $inc: { credits } });
  const payment = await Payment.create({
    supporterEmail: req.user.email,
    supporterName: req.user.name,
    creditsPurchased: credits,
    amountUsd,
    method: 'stripe',
    transactionId: paymentIntentId,
  });

  res.status(201).json(payment);
});

export const createDummyPayment = asyncHandler(async (req, res) => {
  const pkg = findPackage(req.body.credits);
  if (!pkg) {
    res.status(400);
    throw new Error('Invalid credit package selected');
  }

  await User.updateOne({ email: req.user.email }, { $inc: { credits: pkg.credits } });
  const payment = await Payment.create({
    supporterEmail: req.user.email,
    supporterName: req.user.name,
    creditsPurchased: pkg.credits,
    amountUsd: pkg.priceUsd,
    method: 'dummy',
    transactionId: `dummy_${crypto.randomUUID()}`,
  });

  res.status(201).json(payment);
});

export const getMyPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find({ supporterEmail: req.user.email }).sort({ createdAt: -1 });
  res.json(payments);
});

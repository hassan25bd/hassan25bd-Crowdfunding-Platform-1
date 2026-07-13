import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    supporterEmail: { type: String, required: true, lowercase: true, index: true },
    supporterName: { type: String, required: true },
    creditsPurchased: { type: Number, required: true },
    amountUsd: { type: Number, required: true },
    method: { type: String, enum: ['stripe', 'dummy'], required: true },
    transactionId: { type: String, required: true },
  },
  { timestamps: true }
);

export const Payment = mongoose.model('Payment', paymentSchema);

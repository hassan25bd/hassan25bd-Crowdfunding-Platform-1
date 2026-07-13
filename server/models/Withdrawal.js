import mongoose from 'mongoose';

const withdrawalSchema = new mongoose.Schema(
  {
    creatorEmail: { type: String, required: true, lowercase: true, index: true },
    creatorName: { type: String, required: true },
    withdrawalCredit: { type: Number, required: true, min: 1 },
    withdrawalAmount: { type: Number, required: true, min: 0 },
    paymentSystem: { type: String, required: true },
    accountNumber: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved'], default: 'pending' },
    withdrawDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Withdrawal = mongoose.model('Withdrawal', withdrawalSchema);

import mongoose from 'mongoose';

const contributionSchema = new mongoose.Schema(
  {
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true, index: true },
    campaignTitle: { type: String, required: true },
    amount: { type: Number, required: true, min: 1 },
    message: { type: String, default: '' },
    supporterEmail: { type: String, required: true, lowercase: true, index: true },
    supporterName: { type: String, required: true },
    creatorEmail: { type: String, required: true, lowercase: true, index: true },
    creatorName: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  },
  { timestamps: true }
);

export const Contribution = mongoose.model('Contribution', contributionSchema);

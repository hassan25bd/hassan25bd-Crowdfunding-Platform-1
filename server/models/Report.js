import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true, index: true },
    campaignTitle: { type: String, required: true },
    reporterEmail: { type: String, required: true, lowercase: true },
    reporterName: { type: String, required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ['pending', 'resolved'], default: 'pending' },
  },
  { timestamps: true }
);

export const Report = mongoose.model('Report', reportSchema);

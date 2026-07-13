import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema(
  {
    creatorEmail: { type: String, required: true, lowercase: true, index: true },
    creatorName: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    story: { type: String, required: true },
    category: { type: String, required: true },
    fundingGoal: { type: Number, required: true, min: 1 },
    minimumContribution: { type: Number, required: true, min: 1 },
    deadline: { type: Date, required: true },
    rewardInfo: { type: String, default: '' },
    imageUrl: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'suspended'],
      default: 'pending',
    },
    amountRaised: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Campaign = mongoose.model('Campaign', campaignSchema);

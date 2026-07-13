import { Contribution } from '../models/Contribution.js';
import { User } from '../models/User.js';
import { notify } from './notify.js';

export const refundApprovedContributions = async (campaignId) => {
  const approved = await Contribution.find({ campaignId, status: 'approved' });
  for (const contribution of approved) {
    await User.updateOne(
      { email: contribution.supporterEmail },
      { $inc: { credits: contribution.amount } }
    );
    await notify({
      message: `The campaign "${contribution.campaignTitle}" was removed, so your ${contribution.amount} credit contribution was refunded.`,
      toEmail: contribution.supporterEmail,
      actionRoute: '/dashboard/my-contributions',
    });
  }
  await Contribution.deleteMany({ campaignId });
};

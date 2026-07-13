import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { FullScreenLoader } from '../components/Loader';
import { Modal } from '../components/Modal';

export const CampaignDetails = () => {
  const { id } = useParams();
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportSubmitting, setReportSubmitting] = useState(false);

  const loadCampaign = () => {
    setLoading(true);
    api
      .get(`/campaigns/${id}`)
      .then(({ data }) => setCampaign(data))
      .catch(() => setCampaign(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCampaign();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <FullScreenLoader />;
  if (!campaign) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-gray-500">This campaign doesn't exist or is no longer available.</p>
        <Link to="/explore-campaigns" className="mt-4 inline-block font-semibold text-brand-600">
          Back to Explore Campaigns
        </Link>
      </div>
    );
  }

  const percent = Math.min(100, Math.round((campaign.amountRaised / campaign.fundingGoal) * 100) || 0);
  const daysLeft = Math.max(0, Math.ceil((new Date(campaign.deadline) - new Date()) / (1000 * 60 * 60 * 24)));

  const handleContribute = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/campaigns/${id}` } } });
      return;
    }

    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount < campaign.minimumContribution) {
      toast.error(`Minimum contribution is ${campaign.minimumContribution} credits`);
      return;
    }
    if (numericAmount > user.credits) {
      toast.error('Insufficient credits');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/contributions', { campaignId: campaign._id, amount: numericAmount, message });
      toast.success('Contribution submitted! The creator will review it soon.');
      setAmount('');
      setMessage('');
      loadCampaign();
      refreshUser();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not submit contribution');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReport = async (e) => {
    e.preventDefault();
    if (!reportReason.trim()) return;
    setReportSubmitting(true);
    try {
      await api.post('/reports', { campaignId: campaign._id, reason: reportReason.trim() });
      toast.success('Thanks — our team will review this campaign.');
      setReportOpen(false);
      setReportReason('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not submit report');
    } finally {
      setReportSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-2xl bg-gray-100">
            <img src={campaign.imageUrl} alt={campaign.title} className="h-80 w-full object-cover" />
          </div>

          <span className="mt-4 inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
            {campaign.category}
          </span>
          <h1 className="mt-2 text-2xl font-bold text-gray-800 sm:text-3xl">{campaign.title}</h1>
          <p className="mt-1 text-gray-500">by {campaign.creatorName}</p>

          <p className="mt-6 whitespace-pre-line leading-relaxed text-gray-700">{campaign.story}</p>

          {campaign.rewardInfo && (
            <div className="mt-6 rounded-xl bg-accent-500/10 p-4">
              <p className="text-sm font-semibold text-accent-600">What supporters receive</p>
              <p className="mt-1 text-sm text-gray-700">{campaign.rewardInfo}</p>
            </div>
          )}

          {user && user.role === 'supporter' && (
            <button
              onClick={() => setReportOpen(true)}
              className="mt-8 text-sm font-medium text-gray-400 hover:text-red-500"
            >
              Report this campaign
            </button>
          )}
        </div>

        <div className="h-fit rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
            <div className="h-full rounded-full bg-brand-500" style={{ width: `${percent}%` }} />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-gray-800">{campaign.amountRaised}</span>
            <span className="text-sm text-gray-400">of {campaign.fundingGoal} credits</span>
          </div>
          <div className="mt-1 flex justify-between text-sm text-gray-400">
            <span>{percent}% funded</span>
            <span>{daysLeft} days left</span>
          </div>

          <form onSubmit={handleContribute} className="mt-6 space-y-3 border-t border-gray-100 pt-6">
            <label className="block text-sm font-medium text-gray-700">
              Contribution amount (min {campaign.minimumContribution} credits)
            </label>
            <input
              type="number"
              min={campaign.minimumContribution}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              placeholder={`${campaign.minimumContribution}`}
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={2}
              placeholder="Leave a message for the creator (optional)"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {user ? (submitting ? 'Submitting…' : 'Contribute') : 'Log in to Contribute'}
            </button>
            {user && user.role !== 'supporter' && (
              <p className="text-center text-xs text-gray-400">Only supporter accounts can contribute.</p>
            )}
          </form>
        </div>
      </div>

      <Modal open={reportOpen} onClose={() => setReportOpen(false)} title="Report this campaign">
        <form onSubmit={handleReport} className="space-y-3">
          <textarea
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            rows={4}
            required
            placeholder="Tell us why this campaign looks suspicious or fraudulent…"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
          <button
            type="submit"
            disabled={reportSubmitting}
            className="w-full rounded-lg bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {reportSubmitting ? 'Submitting…' : 'Submit Report'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

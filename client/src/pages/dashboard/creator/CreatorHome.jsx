import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../../../api/axios';
import { useAuth } from '../../../context/AuthContext';
import { StatCard } from '../../../components/dashboard/StatCard';
import { Modal } from '../../../components/Modal';

export const CreatorHome = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState(null);

  const load = () => {
    setLoading(true);
    Promise.all([
      api.get('/users/stats/creator').then(({ data }) => setStats(data)),
      api.get('/contributions/pending').then(({ data }) => setPending(data)),
    ]).finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleDecision = async (id, decision) => {
    try {
      await api.patch(`/contributions/${id}/${decision}`);
      toast.success(`Contribution ${decision}d`);
      setViewing(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">Welcome back, {user.name.split(' ')[0]}</h1>
      <p className="mt-1 text-gray-500">Here's how your campaigns are performing.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total Campaigns" value={stats?.totalCampaigns ?? '—'} />
        <StatCard label="Active Campaigns" value={stats?.activeCampaigns ?? '—'} />
        <StatCard label="Total Amount Raised" value={stats ? `${stats.totalAmountRaised} credits` : '—'} accent />
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-semibold text-gray-800">Contributions To Review</h2>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead className="border-b border-gray-100 text-gray-500">
              <tr>
                <th className="px-4 py-3 font-medium">Supporter</th>
                <th className="px-4 py-3 font-medium">Campaign</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Details</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                    Loading…
                  </td>
                </tr>
              ) : pending.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                    No contributions waiting for review.
                  </td>
                </tr>
              ) : (
                pending.map((c) => (
                  <tr key={c._id} className="border-b border-gray-50 last:border-0">
                    <td className="px-4 py-3 font-medium text-gray-800">{c.supporterName}</td>
                    <td className="px-4 py-3 text-gray-600">{c.campaignTitle}</td>
                    <td className="px-4 py-3 text-gray-600">{c.amount} credits</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setViewing(c)}
                        className="font-medium text-brand-600 hover:text-brand-700"
                      >
                        View
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDecision(c._id, 'approve')}
                          className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleDecision(c._id, 'reject')}
                          className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-200"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={Boolean(viewing)} onClose={() => setViewing(null)} title="Contribution Detail">
        {viewing && (
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium text-gray-500">Supporter:</span> {viewing.supporterName} (
              {viewing.supporterEmail})
            </p>
            <p>
              <span className="font-medium text-gray-500">Campaign:</span> {viewing.campaignTitle}
            </p>
            <p>
              <span className="font-medium text-gray-500">Amount:</span> {viewing.amount} credits
            </p>
            <p>
              <span className="font-medium text-gray-500">Message:</span>{' '}
              {viewing.message || <span className="text-gray-400">No message left</span>}
            </p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleDecision(viewing._id, 'approve')}
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
              >
                Approve
              </button>
              <button
                onClick={() => handleDecision(viewing._id, 'reject')}
                className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-200"
              >
                Reject
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

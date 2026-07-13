import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../../../api/axios';
import { StatCard } from '../../../components/dashboard/StatCard';

export const AdminHome = () => {
  const [stats, setStats] = useState(null);
  const [pending, setPending] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    Promise.all([
      api.get('/users/stats/admin').then(({ data }) => setStats(data)),
      api.get('/campaigns/pending').then(({ data }) => setPending(data)),
      api.get('/withdrawals/pending').then(({ data }) => setWithdrawals(data)),
    ]).finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleDecision = async (id, status) => {
    try {
      await api.patch(`/campaigns/${id}/status`, { status });
      toast.success(`Campaign ${status}`);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handlePaymentSuccess = async (id) => {
    try {
      await api.patch(`/withdrawals/${id}/approve`);
      toast.success('Withdrawal marked as paid');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not process withdrawal');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">Admin Overview</h1>
      <p className="mt-1 text-gray-500">Platform-wide numbers and items waiting on you.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Supporters" value={stats?.totalSupporters ?? '—'} />
        <StatCard label="Total Creators" value={stats?.totalCreators ?? '—'} />
        <StatCard label="Total Available Credits" value={stats?.totalAvailableCredits ?? '—'} />
        <StatCard label="Total Payments Processed" value={stats?.totalPaymentsProcessed ?? '—'} accent />
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-semibold text-gray-800">Campaign Approvals</h2>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead className="border-b border-gray-100 text-gray-500">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Creator</th>
                <th className="px-4 py-3 font-medium">Goal</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                    Loading…
                  </td>
                </tr>
              ) : pending.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                    No campaigns waiting for approval.
                  </td>
                </tr>
              ) : (
                pending.map((c) => (
                  <tr key={c._id} className="border-b border-gray-50 last:border-0">
                    <td className="px-4 py-3 font-medium text-gray-800">{c.title}</td>
                    <td className="px-4 py-3 text-gray-600">{c.creatorName}</td>
                    <td className="px-4 py-3 text-gray-600">{c.fundingGoal} credits</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDecision(c._id, 'approved')}
                          className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleDecision(c._id, 'rejected')}
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

      <div className="mt-10">
        <h2 className="text-lg font-semibold text-gray-800">Withdrawal Requests</h2>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead className="border-b border-gray-100 text-gray-500">
              <tr>
                <th className="px-4 py-3 font-medium">Creator</th>
                <th className="px-4 py-3 font-medium">Credits</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Payment System</th>
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
              ) : withdrawals.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                    No pending withdrawal requests.
                  </td>
                </tr>
              ) : (
                withdrawals.map((w) => (
                  <tr key={w._id} className="border-b border-gray-50 last:border-0">
                    <td className="px-4 py-3 font-medium text-gray-800">{w.creatorName}</td>
                    <td className="px-4 py-3 text-gray-600">{w.withdrawalCredit}</td>
                    <td className="px-4 py-3 text-gray-600">${w.withdrawalAmount}</td>
                    <td className="px-4 py-3 text-gray-600">{w.paymentSystem}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handlePaymentSuccess(w._id)}
                        className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700"
                      >
                        Payment Success
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

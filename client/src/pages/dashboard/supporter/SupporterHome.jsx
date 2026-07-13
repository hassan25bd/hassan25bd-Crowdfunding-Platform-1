import { useEffect, useState } from 'react';
import { api } from '../../../api/axios';
import { useAuth } from '../../../context/AuthContext';
import { StatCard } from '../../../components/dashboard/StatCard';
import { StatusBadge } from '../../../components/StatusBadge';

export const SupporterHome = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [approved, setApproved] = useState([]);
  const [loadingApproved, setLoadingApproved] = useState(true);

  useEffect(() => {
    api.get('/users/stats/supporter').then(({ data }) => setStats(data));
    api
      .get('/contributions/mine', { params: { status: 'approved', limit: 50 } })
      .then(({ data }) => setApproved(data.contributions))
      .finally(() => setLoadingApproved(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">Welcome back, {user.name.split(' ')[0]}</h1>
      <p className="mt-1 text-gray-500">Here's a snapshot of your support on CrowdNest.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total Contributions" value={stats?.totalContributions ?? '—'} />
        <StatCard label="Pending Contributions" value={stats?.totalPendingContributions ?? '—'} />
        <StatCard
          label="Total Amount Contributed"
          value={stats ? `${stats.totalAmountContributed} credits` : '—'}
          accent
        />
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-semibold text-gray-800">Approved Contributions</h2>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
          <table className="w-full min-w-[500px] text-left text-sm">
            <thead className="border-b border-gray-100 text-gray-500">
              <tr>
                <th className="px-4 py-3 font-medium">Campaign</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Creator</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {loadingApproved ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                    Loading…
                  </td>
                </tr>
              ) : approved.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                    None of your contributions have been approved yet.
                  </td>
                </tr>
              ) : (
                approved.map((c) => (
                  <tr key={c._id} className="border-b border-gray-50 last:border-0">
                    <td className="px-4 py-3 font-medium text-gray-800">{c.campaignTitle}</td>
                    <td className="px-4 py-3 text-gray-600">{c.amount} credits</td>
                    <td className="px-4 py-3 text-gray-600">{c.creatorName}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={c.status} />
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

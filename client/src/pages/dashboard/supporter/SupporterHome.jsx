import { useEffect, useState } from 'react';
import { api } from '../../../api/axios';
import { useAuth } from '../../../context/AuthContext';
import { StatCard } from '../../../components/dashboard/StatCard';

export const SupporterHome = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/users/stats/supporter').then(({ data }) => setStats(data));
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
    </div>
  );
};

import { useEffect, useState } from 'react';
import { api } from '../../api/axios';

export const ImpactSection = () => {
  const [stats, setStats] = useState({ totalCampaigns: 0, totalCreditsRaised: 0, totalSupporters: 0 });

  useEffect(() => {
    api
      .get('/campaigns/stats/public')
      .then(({ data }) => setStats(data))
      .catch(() => {});
  }, []);

  const items = [
    { label: 'Campaigns funded', value: stats.totalCampaigns },
    { label: 'Credits raised by creators', value: stats.totalCreditsRaised },
    { label: 'Supporters in the community', value: stats.totalSupporters },
  ];

  return (
    <section className="bg-brand-700 py-16 text-white">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold sm:text-3xl">Platform Impact in Numbers</h2>
        <p className="mt-2 text-brand-100">Real, live numbers pulled straight from our database.</p>

        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {items.map((item) => (
            <div key={item.label}>
              <p className="text-4xl font-bold">{item.value.toLocaleString()}</p>
              <p className="mt-2 text-brand-100">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

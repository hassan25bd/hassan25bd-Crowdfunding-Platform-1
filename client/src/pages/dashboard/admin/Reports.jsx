import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../../../api/axios';
import { StatusBadge } from '../../../components/StatusBadge';

export const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api
      .get('/reports')
      .then(({ data }) => setReports(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleResolve = async (id, action) => {
    try {
      await api.patch(`/reports/${id}/resolve`, { action });
      toast.success(action === 'suspend' ? 'Campaign suspended' : 'Campaign deleted');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not resolve report');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
      <p className="mt-1 text-gray-500">Campaigns flagged by supporters as suspicious or fraudulent.</p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="border-b border-gray-100 text-gray-500">
            <tr>
              <th className="px-4 py-3 font-medium">Reporter</th>
              <th className="px-4 py-3 font-medium">Campaign</th>
              <th className="px-4 py-3 font-medium">Reason</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                  Loading…
                </td>
              </tr>
            ) : reports.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                  No reports filed yet.
                </td>
              </tr>
            ) : (
              reports.map((r) => (
                <tr key={r._id} className="border-b border-gray-50 last:border-0 align-top">
                  <td className="px-4 py-3 font-medium text-gray-800">{r.reporterName}</td>
                  <td className="px-4 py-3 text-gray-600">{r.campaignTitle}</td>
                  <td className="max-w-xs px-4 py-3 text-gray-600">{r.reason}</td>
                  <td className="px-4 py-3 text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-4 py-3">
                    {r.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleResolve(r._id, 'suspend')}
                          className="rounded-lg bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-200"
                        >
                          Suspend
                        </button>
                        <button
                          onClick={() => handleResolve(r._id, 'delete')}
                          className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

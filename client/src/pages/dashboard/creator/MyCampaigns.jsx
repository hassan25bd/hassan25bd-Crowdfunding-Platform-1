import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../../../api/axios';
import { StatusBadge } from '../../../components/StatusBadge';
import { Modal } from '../../../components/Modal';

export const MyCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', story: '', rewardInfo: '' });
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api
      .get('/campaigns/mine')
      .then(({ data }) => setCampaigns(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const openEdit = (campaign) => {
    setEditing(campaign);
    setEditForm({ title: campaign.title, story: campaign.story, rewardInfo: campaign.rewardInfo || '' });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.patch(`/campaigns/${editing._id}`, editForm);
      toast.success('Campaign updated');
      setEditing(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (campaign) => {
    if (!confirm(`Delete "${campaign.title}"? Approved supporters will be refunded.`)) return;
    try {
      await api.delete(`/campaigns/${campaign._id}`);
      toast.success('Campaign deleted');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">My Campaigns</h1>
      <p className="mt-1 text-gray-500">All campaigns you've launched, newest deadline first.</p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="border-b border-gray-100 text-gray-500">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Raised / Goal</th>
              <th className="px-4 py-3 font-medium">Deadline</th>
              <th className="px-4 py-3 font-medium">Status</th>
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
            ) : campaigns.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                  You haven't launched a campaign yet.
                </td>
              </tr>
            ) : (
              campaigns.map((c) => (
                <tr key={c._id} className="border-b border-gray-50 last:border-0">
                  <td className="px-4 py-3 font-medium text-gray-800">{c.title}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {c.amountRaised} / {c.fundingGoal}
                  </td>
                  <td className="px-4 py-3 text-gray-400">{new Date(c.deadline).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <button onClick={() => openEdit(c)} className="font-medium text-brand-600 hover:text-brand-700">
                        Update
                      </button>
                      <button onClick={() => handleDelete(c)} className="font-medium text-red-500 hover:text-red-600">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title="Update Campaign">
        <form onSubmit={handleUpdate} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              value={editForm.title}
              onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Story</label>
            <textarea
              rows={4}
              value={editForm.story}
              onChange={(e) => setEditForm((f) => ({ ...f, story: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Reward Info</label>
            <input
              value={editForm.rewardInfo}
              onChange={(e) => setEditForm((f) => ({ ...f, rewardInfo: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

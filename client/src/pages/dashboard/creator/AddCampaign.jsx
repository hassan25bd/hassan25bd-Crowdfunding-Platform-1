import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../../../api/axios';
import { CATEGORIES } from '../../../utils/constants';
import { ImageUploadField } from '../../../components/ImageUploadField';

const initialForm = {
  title: '',
  story: '',
  category: CATEGORIES[0],
  fundingGoal: '',
  minimumContribution: '',
  deadline: '',
  rewardInfo: '',
  imageUrl: '',
};

export const AddCampaign = () => {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.imageUrl) {
      toast.error('Please upload a cover image or paste an image URL');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/campaigns', {
        ...form,
        fundingGoal: Number(form.fundingGoal),
        minimumContribution: Number(form.minimumContribution),
      });
      toast.success('Campaign submitted for admin review!');
      navigate('/dashboard/my-campaigns');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not create campaign');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-800">Add New Campaign</h1>
      <p className="mt-1 text-gray-500">
        Your campaign will be visible to supporters once an admin approves it.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-gray-700">Campaign Title</label>
          <input
            required
            value={form.title}
            onChange={update('title')}
            placeholder="Help us build a solar-powered water pump"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Campaign Story</label>
          <textarea
            required
            rows={5}
            value={form.story}
            onChange={update('story')}
            placeholder="Describe what you're building and why it matters…"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              value={form.category}
              onChange={update('category')}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Deadline</label>
            <input
              type="date"
              required
              value={form.deadline}
              onChange={update('deadline')}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Funding Goal (credits)</label>
            <input
              type="number"
              required
              min={1}
              value={form.fundingGoal}
              onChange={update('fundingGoal')}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Minimum Contribution (credits)</label>
            <input
              type="number"
              required
              min={1}
              value={form.minimumContribution}
              onChange={update('minimumContribution')}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Reward Info</label>
          <input
            value={form.rewardInfo}
            onChange={update('rewardInfo')}
            placeholder="What supporters receive for pledging"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>

        <ImageUploadField
          label="Cover Image"
          value={form.imageUrl}
          onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))}
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Submitting…' : 'Add Campaign'}
        </button>
      </form>
    </div>
  );
};

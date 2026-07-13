const STYLES = {
  pending: 'bg-amber-50 text-amber-700',
  approved: 'bg-brand-50 text-brand-700',
  rejected: 'bg-red-50 text-red-700',
  suspended: 'bg-gray-100 text-gray-500',
  resolved: 'bg-brand-50 text-brand-700',
};

export const StatusBadge = ({ status }) => (
  <span
    className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
      STYLES[status] || 'bg-gray-100 text-gray-600'
    }`}
  >
    {status}
  </span>
);

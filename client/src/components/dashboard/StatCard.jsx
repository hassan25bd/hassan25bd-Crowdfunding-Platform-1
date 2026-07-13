export const StatCard = ({ label, value, accent = false }) => (
  <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
    <p className="text-sm text-gray-500">{label}</p>
    <p className={`mt-2 text-3xl font-bold ${accent ? 'text-brand-600' : 'text-gray-800'}`}>{value}</p>
  </div>
);

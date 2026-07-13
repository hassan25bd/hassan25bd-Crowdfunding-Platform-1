import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../../../api/axios';

export const WithdrawalRequests = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api
      .get('/withdrawals/pending')
      .then(({ data }) => setWithdrawals(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

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
      <h1 className="text-2xl font-bold text-gray-800">Withdrawal Requests</h1>
      <p className="mt-1 text-gray-500">Pending payout requests from creators.</p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="border-b border-gray-100 text-gray-500">
            <tr>
              <th className="px-4 py-3 font-medium">Creator</th>
              <th className="px-4 py-3 font-medium">Credits</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Payment System</th>
              <th className="px-4 py-3 font-medium">Account</th>
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
            ) : withdrawals.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
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
                  <td className="px-4 py-3 text-gray-600">{w.accountNumber}</td>
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
  );
};

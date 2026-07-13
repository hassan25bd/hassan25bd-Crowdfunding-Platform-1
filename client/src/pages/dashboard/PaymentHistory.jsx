import { useEffect, useState } from 'react';
import { api } from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/StatusBadge';

export const PaymentHistory = () => {
  const { user } = useAuth();
  const isCreator = user.role === 'creator';
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const endpoint = isCreator ? '/withdrawals/mine' : '/payments/mine';
    api
      .get(endpoint)
      .then(({ data }) => setRows(data))
      .finally(() => setLoading(false));
  }, [isCreator]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">Payment History</h1>
      <p className="mt-1 text-gray-500">
        {isCreator ? 'Every withdrawal you\'ve requested and its status.' : 'Every credit purchase you\'ve made.'}
      </p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead className="border-b border-gray-100 text-gray-500">
            <tr>
              {isCreator ? (
                <>
                  <th className="px-4 py-3 font-medium">Credits</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Payment System</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                </>
              ) : (
                <>
                  <th className="px-4 py-3 font-medium">Credits Purchased</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Method</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                  Loading…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                  Nothing here yet.
                </td>
              </tr>
            ) : isCreator ? (
              rows.map((w) => (
                <tr key={w._id} className="border-b border-gray-50 last:border-0">
                  <td className="px-4 py-3 text-gray-800">{w.withdrawalCredit}</td>
                  <td className="px-4 py-3 text-gray-600">${w.withdrawalAmount}</td>
                  <td className="px-4 py-3 text-gray-600">{w.paymentSystem}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={w.status} />
                  </td>
                  <td className="px-4 py-3 text-gray-400">{new Date(w.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              rows.map((p) => (
                <tr key={p._id} className="border-b border-gray-50 last:border-0">
                  <td className="px-4 py-3 text-gray-800">{p.creditsPurchased}</td>
                  <td className="px-4 py-3 text-gray-600">${p.amountUsd}</td>
                  <td className="px-4 py-3 capitalize text-gray-600">{p.method}</td>
                  <td className="px-4 py-3 text-gray-400">{new Date(p.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

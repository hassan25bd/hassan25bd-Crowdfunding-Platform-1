import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../../../api/axios';
import { CREDITS_PER_DOLLAR } from '../../../utils/constants';

const PAYMENT_SYSTEMS = ['Stripe', 'Bkash', 'Rocket', 'Nagad'];

export const Withdrawals = () => {
  const [summary, setSummary] = useState(null);
  const [credits, setCredits] = useState('');
  const [paymentSystem, setPaymentSystem] = useState(PAYMENT_SYSTEMS[0]);
  const [accountNumber, setAccountNumber] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadSummary = () => {
    api.get('/withdrawals/summary').then(({ data }) => setSummary(data));
  };

  useEffect(() => {
    loadSummary();
  }, []);

  const withdrawAmountUsd = credits ? (Number(credits) / CREDITS_PER_DOLLAR).toFixed(2) : '0.00';
  const hasEnoughCredit = summary && Number(credits) > 0 && Number(credits) <= summary.availableCredits;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/withdrawals', {
        creditsToWithdraw: Number(credits),
        paymentSystem,
        accountNumber,
      });
      toast.success('Withdrawal request submitted');
      setCredits('');
      setAccountNumber('');
      loadSummary();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Withdrawal request failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-800">Withdrawals</h1>
      <p className="mt-1 text-gray-500">
        {CREDITS_PER_DOLLAR} credits = $1. Minimum withdrawal is {summary?.minWithdrawalCredits ?? 200} credits.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Total Raised Credits</p>
          <p className="mt-2 text-2xl font-bold text-gray-800">{summary?.totalRaisedCredits ?? '—'}</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Available to Withdraw</p>
          <p className="mt-2 text-2xl font-bold text-brand-600">
            {summary ? `${summary.availableCredits} credits ($${summary.availableUsd})` : '—'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-gray-700">Credits To Withdraw</label>
          <input
            type="number"
            required
            min={summary?.minWithdrawalCredits ?? 200}
            value={credits}
            onChange={(e) => setCredits(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Withdraw Amount ($)</label>
          <input
            readOnly
            value={withdrawAmountUsd}
            className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Payment System</label>
          <select
            value={paymentSystem}
            onChange={(e) => setPaymentSystem(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            {PAYMENT_SYSTEMS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Account Number</label>
          <input
            required
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>

        {!hasEnoughCredit && credits ? (
          <p className="text-center text-sm font-medium text-red-500">Insufficient credit</p>
        ) : (
          <button
            type="submit"
            disabled={submitting || !hasEnoughCredit}
            className="w-full rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Submitting…' : 'Withdraw'}
          </button>
        )}
      </form>
    </div>
  );
};

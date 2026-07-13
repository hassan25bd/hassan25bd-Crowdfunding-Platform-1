import { useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../../../api/axios';
import { useAuth } from '../../../context/AuthContext';
import { CREDIT_PACKAGES } from '../../../utils/constants';
import { isStripeConfigured } from '../../../utils/stripe';
import { StripeCheckoutModal } from '../../../components/StripeCheckoutModal';

export const PurchaseCredit = () => {
  const { refreshUser } = useAuth();
  const [processingCredits, setProcessingCredits] = useState(null);
  const [checkout, setCheckout] = useState(null); // { clientSecret, credits }

  const handleSelect = async (pkg) => {
    setProcessingCredits(pkg.credits);
    try {
      if (isStripeConfigured) {
        const { data } = await api.post('/payments/create-intent', { credits: pkg.credits });
        setCheckout({ clientSecret: data.clientSecret, credits: pkg.credits });
      } else {
        await api.post('/payments/dummy', { credits: pkg.credits });
        await refreshUser();
        toast.success(`${pkg.credits} credits added to your account!`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not start purchase');
    } finally {
      setProcessingCredits(null);
    }
  };

  const handleCheckoutSuccess = async () => {
    setCheckout(null);
    await refreshUser();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">Purchase Credit</h1>
      <p className="mt-1 text-gray-500">
        {isStripeConfigured
          ? 'Buy credits securely with Stripe to support more campaigns.'
          : 'Stripe test keys are not configured yet, so purchases use a simulated payment for now.'}
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CREDIT_PACKAGES.map((pkg) => (
          <div key={pkg.credits} className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
            <p className="text-3xl font-bold text-brand-600">{pkg.credits}</p>
            <p className="text-sm text-gray-500">credits</p>
            <p className="mt-3 text-xl font-semibold text-gray-800">${pkg.priceUsd}</p>
            <button
              onClick={() => handleSelect(pkg)}
              disabled={processingCredits === pkg.credits}
              className="mt-4 w-full rounded-lg bg-brand-600 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {processingCredits === pkg.credits ? 'Please wait…' : 'Buy now'}
            </button>
          </div>
        ))}
      </div>

      <StripeCheckoutModal
        open={Boolean(checkout)}
        onClose={() => setCheckout(null)}
        clientSecret={checkout?.clientSecret}
        credits={checkout?.credits}
        onSuccess={handleCheckoutSuccess}
      />
    </div>
  );
};

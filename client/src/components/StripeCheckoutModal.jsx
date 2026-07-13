import { useState } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';
import { api } from '../api/axios';
import { Modal } from './Modal';
import { stripePromise } from '../utils/stripe';

const CheckoutForm = ({ credits, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setSubmitting(true);
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (error) {
      toast.error(error.message || 'Payment failed');
      setSubmitting(false);
      return;
    }

    try {
      await api.post('/payments/confirm', { paymentIntentId: paymentIntent.id });
      toast.success(`${credits} credits added to your account!`);
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not confirm payment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || submitting}
        className="w-full rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? 'Processing…' : 'Pay now'}
      </button>
      <p className="text-center text-xs text-gray-400">
        Use test card 4242 4242 4242 4242, any future date, any CVC.
      </p>
    </form>
  );
};

export const StripeCheckoutModal = ({ open, onClose, clientSecret, credits, onSuccess }) => (
  <Modal open={open} onClose={onClose} title={`Purchase ${credits} credits`}>
    {clientSecret && (
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <CheckoutForm credits={credits} onSuccess={onSuccess} />
      </Elements>
    )}
  </Modal>
);

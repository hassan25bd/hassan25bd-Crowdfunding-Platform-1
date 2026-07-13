import { loadStripe } from '@stripe/stripe-js';

const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
export const isStripeConfigured = Boolean(key) && key.startsWith('pk_') && key.length > 30;
export const stripePromise = isStripeConfigured ? loadStripe(key) : null;

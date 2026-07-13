# CrowdNest — Client

React + Vite + Tailwind frontend for the Crowdfunding Platform. See the [server README](../server/README.md) for the API, and the [repo root README](../README.md) for the full project overview, admin credentials, and submission links.

## Setup

1. `npm install`
2. Copy `.env.example` to `.env`:
   - `VITE_API_URL` — defaults to `http://localhost:5000/api`
   - `VITE_GOOGLE_CLIENT_ID` — same Google OAuth client ID as the server, from [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   - `VITE_STRIPE_PUBLISHABLE_KEY` — test publishable key from [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys); without it, Purchase Credit falls back to a simulated payment
   - `VITE_IMGBB_API_KEY` — free key from [api.imgbb.com](https://api.imgbb.com/); without it, image fields still accept a pasted URL
3. `npm run dev`

## Structure

- `src/layouts/` — `BasicLayout` (public pages) and `DashboardLayout` (role-based sidebar + topbar)
- `src/context/AuthContext.jsx` — holds the logged-in user and a `loading` flag; route guards wait for `loading === false` before redirecting, which is what keeps a page reload on a private route from bouncing to `/login`
- `src/routes/` — `PrivateRoute` (must be logged in) and `RoleRoute` (must be logged in as a specific role)
- `src/pages/dashboard/{supporter,creator,admin}/` — role-specific dashboard pages
- `src/components/` — shared UI (Navbar, Footer, CampaignCard, Modal, NotificationBell, StripeCheckoutModal, ImageUploadField)

## Notable implementation details

- Google Sign-In uses the Google Identity Services script (loaded in `index.html`) directly — no Firebase dependency.
- Purchase Credit tries Stripe first (`@stripe/react-stripe-js` PaymentIntent flow) and only falls back to a dummy payment if `VITE_STRIPE_PUBLISHABLE_KEY` isn't a real-looking key.
- Campaign cover images and profile pictures upload straight to imgBB from `ImageUploadField`, with a manual URL field as a fallback.

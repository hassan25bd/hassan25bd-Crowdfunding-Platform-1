# Crowdfunding Platform — Server

Express + MongoDB (Mongoose) API for the Crowdfunding Platform. See [../client](../client) for the frontend, and the repo root README for the full project overview and submission details.

## Setup

1. `npm install`
2. Copy `.env.example` to `.env` and fill in real values:
   - `MONGODB_URI` — free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) → Database → Connect → Drivers
   - `JWT_SECRET` — any long random string, e.g. `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`
   - `GOOGLE_CLIENT_ID` — [Google Cloud Console](https://console.cloud.google.com/apis/credentials) → Create Credentials → OAuth client ID → Web application
   - `STRIPE_SECRET_KEY` — free test key at [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
   - `IMGBB_API_KEY` — free key at [api.imgbb.com](https://api.imgbb.com/)
3. `npm run dev` (requires the env vars above), or `npm run dev:memory` to run against a throwaway in-memory MongoDB with no setup at all (useful for quickly trying the API without an Atlas account).

## API Overview

| Resource | Routes |
|---|---|
| Auth | `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/google`, `GET /api/auth/me` |
| Users (admin) | `GET /api/users`, `PATCH /api/users/:id/role`, `DELETE /api/users/:id` |
| Dashboard stats | `GET /api/users/stats/admin`, `GET /api/users/stats/creator`, `GET /api/users/stats/supporter` |
| Campaigns | `GET /api/campaigns`, `GET /api/campaigns/top-funded`, `GET /api/campaigns/mine`, `GET /api/campaigns/pending` (admin), `GET /api/campaigns/:id`, `POST /api/campaigns`, `PATCH /api/campaigns/:id`, `PATCH /api/campaigns/:id/status` (admin), `DELETE /api/campaigns/:id`, `DELETE /api/campaigns/:id/admin` |
| Contributions | `POST /api/contributions`, `GET /api/contributions/mine` (paginated), `GET /api/contributions/pending` (creator), `PATCH /api/contributions/:id/approve`, `PATCH /api/contributions/:id/reject` |
| Withdrawals | `GET /api/withdrawals/summary`, `POST /api/withdrawals`, `GET /api/withdrawals/mine`, `GET /api/withdrawals/pending` (admin), `PATCH /api/withdrawals/:id/approve` (admin) |
| Payments | `GET /api/payments/packages`, `POST /api/payments/create-intent`, `POST /api/payments/confirm`, `POST /api/payments/dummy`, `GET /api/payments/mine` |
| Notifications | `GET /api/notifications/mine` |
| Reports | `POST /api/reports`, `GET /api/reports` (admin), `PATCH /api/reports/:id/resolve` (admin) |

## Business rules worth knowing

- Signup bonus: 50 credits for supporters, 20 for creators, granted once at registration.
- Contributions are an escrow model: credits are deducted from the supporter immediately on submission (`pending`), added to the campaign's raised total on creator approval, or refunded to the supporter on rejection.
- Withdrawals: 20 credits = $1, minimum 200 credits ($10) per withdrawal. Available balance is computed live via aggregation (`sum of a creator's campaign.amountRaised` minus `sum of their pending+approved withdrawals`) rather than stored as a separate mutable field, so it can't drift out of sync.
- Deleting a campaign (by its creator or an admin) refunds every currently-approved contribution back to its supporter before removing the campaign.

## Deployment

Configured for Vercel via `vercel.json` + `api/index.js` (wraps the Express app as a serverless function). Set the same environment variables from `.env` in the Vercel project settings.

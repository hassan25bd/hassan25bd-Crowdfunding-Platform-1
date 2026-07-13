# CrowdNest — Crowdfunding Platform

A full-stack MERN crowdfunding platform where Creators launch campaigns, Supporters back the ones they believe in with credits, and Admins keep the platform honest. Built with React + Vite + Tailwind on the client and Express + MongoDB on the server.

## Links

- **Live Site:** _pending deployment_
- **Client-Side GitHub Repository:** https://github.com/hassan25bd/hassan25bd-Crowdfunding-Platform-1 (`/client`)
- **Server-Side GitHub Repository:** https://github.com/hassan25bd/hassan25bd-Crowdfunding-Platform-1 (`/server`)

This project uses a single repository with two independent apps (`/client` and `/server`), each with its own `package.json`, `.env`, and deployment config.

## Admin Credentials

```
Email:    admin@crowdnest.com
Password: Admin@12345
```

Created by `server/scripts/seed.js`, along with demo creators, supporters, and campaigns so the platform isn't empty on first visit.

## Features

- Three distinct roles (Supporter, Creator, Admin), each with a purpose-built dashboard and its own navigation, matching a shared `DashboardLayout` shell.
- Custom JWT authentication (bcrypt-hashed passwords) plus Google Sign-In via Google Identity Services, verified server-side with `google-auth-library`.
- Session persists across page reloads on private routes — the auth check runs before route guards decide to redirect, so refreshing a dashboard page never bounces you back to `/login`.
- Credit-based escrow system: a Supporter's credits are deducted the moment they contribute, held until the Creator approves (added to the campaign's raised total) or rejects (refunded automatically).
- Campaign lifecycle moderation: every new campaign starts `pending` and only becomes visible to Supporters after Admin approval; Admins can also suspend or delete campaigns flagged by reports.
- Withdrawal system with live-computed balances (20 credits = $1, 200-credit minimum) — a Creator's available balance is derived via aggregation, not a separately stored field, so it can never drift out of sync.
- Real Stripe test-mode checkout for purchasing credit packages, with an automatic dummy-payment fallback so the flow is testable even before Stripe keys are configured.
- In-app notification system (contribution approved/rejected, campaign approved/rejected/suspended, withdrawal paid out) shown in a floating, click-outside-to-dismiss bell dropdown.
- Optional image-upload challenge implemented: campaign covers and profile pictures can be uploaded directly to imgBB instead of just pasting a URL.
- Fully responsive layout — dashboard sidebar collapses to an off-canvas drawer on mobile, all data tables scroll horizontally instead of breaking the page.
- No Lorem ipsum anywhere: all campaign stories, testimonials, and homepage copy are genuine written content, and all imagery is real photography sourced from Unsplash.
- A report system lets Supporters flag suspicious campaigns, which Admins can then suspend or delete (auto-refunding any already-approved contributions).

## Tech Stack

- **Client:** React 19, Vite, React Router, Tailwind CSS v4, Swiper, `@stripe/react-stripe-js`, Axios
- **Server:** Node.js, Express 5, MongoDB with Mongoose, JWT, bcryptjs, `google-auth-library`, Stripe

## Local Setup

### Server

```bash
cd server
npm install
cp .env.example .env   # fill in MONGODB_URI at minimum
npm run seed            # creates admin + demo data (safe to re-run)
npm run dev
```

`npm run dev:memory` runs the whole API against a throwaway in-memory MongoDB with zero setup — useful for a quick look without an Atlas account.

### Client

```bash
cd client
npm install
cp .env.example .env   # VITE_API_URL defaults to http://localhost:5000/api
npm run dev
```

See [server/README.md](server/README.md) and [client/README.md](client/README.md) for the full API reference and where to obtain each optional API key (Google OAuth, Stripe, imgBB).

## Deployment

Both apps are configured for Vercel: the client builds as a static Vite app, and the server ships with `vercel.json` + `api/index.js` wrapping Express as a serverless function.

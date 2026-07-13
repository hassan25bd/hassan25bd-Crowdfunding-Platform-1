export const SITE_NAME = 'CrowdNest';
export const GITHUB_REPO_URL = 'https://github.com/hassan25bd/hassan25bd-Crowdfunding-Platform-1';
export const CREDITS_PER_DOLLAR = 20;
export const MIN_WITHDRAWAL_CREDITS = 200;

export const CREDIT_PACKAGES = [
  { credits: 100, priceUsd: 10 },
  { credits: 300, priceUsd: 25 },
  { credits: 800, priceUsd: 60 },
  { credits: 1500, priceUsd: 110 },
];

export const DASHBOARD_NAV = {
  supporter: [
    { label: 'Home', to: '/dashboard/supporter-home' },
    { label: 'Explore Campaigns', to: '/dashboard/explore-campaigns' },
    { label: 'My Contributions', to: '/dashboard/my-contributions' },
    { label: 'Purchase Credit', to: '/dashboard/purchase-credit' },
    { label: 'Payment History', to: '/dashboard/payment-history' },
  ],
  creator: [
    { label: 'Home', to: '/dashboard/creator-home' },
    { label: 'Add New Campaign', to: '/dashboard/add-campaign' },
    { label: 'My Campaigns', to: '/dashboard/my-campaigns' },
    { label: 'Withdrawals', to: '/dashboard/withdrawals' },
    { label: 'Payment History', to: '/dashboard/payment-history' },
  ],
  admin: [
    { label: 'Home', to: '/dashboard/admin-home' },
    { label: 'Manage Users', to: '/dashboard/manage-users' },
    { label: 'Manage Campaigns', to: '/dashboard/manage-campaigns' },
    { label: 'Withdrawal Requests', to: '/dashboard/withdrawal-requests' },
    { label: 'Reports', to: '/dashboard/reports' },
  ],
};

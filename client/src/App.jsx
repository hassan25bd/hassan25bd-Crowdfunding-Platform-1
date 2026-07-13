import { Routes, Route } from 'react-router-dom';
import { BasicLayout } from './layouts/BasicLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import { PrivateRoute } from './routes/PrivateRoute';
import { RoleRoute } from './routes/RoleRoute';

import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ExploreCampaigns } from './pages/ExploreCampaigns';
import { CampaignDetails } from './pages/CampaignDetails';
import { NotFound } from './pages/NotFound';

import { DashboardIndex } from './pages/dashboard/DashboardIndex';
import { PaymentHistory } from './pages/dashboard/PaymentHistory';
import { SupporterHome } from './pages/dashboard/supporter/SupporterHome';
import { MyContributions } from './pages/dashboard/supporter/MyContributions';
import { PurchaseCredit } from './pages/dashboard/supporter/PurchaseCredit';

function App() {
  return (
    <Routes>
      <Route element={<BasicLayout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="explore-campaigns" element={<ExploreCampaigns />} />
        <Route path="campaigns/:id" element={<CampaignDetails />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route
        path="dashboard"
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<DashboardIndex />} />
        <Route path="payment-history" element={<PaymentHistory />} />

        {/* Supporter */}
        <Route
          path="supporter-home"
          element={
            <RoleRoute roles={['supporter']}>
              <SupporterHome />
            </RoleRoute>
          }
        />
        <Route
          path="explore-campaigns"
          element={
            <RoleRoute roles={['supporter']}>
              <ExploreCampaigns />
            </RoleRoute>
          }
        />
        <Route
          path="my-contributions"
          element={
            <RoleRoute roles={['supporter']}>
              <MyContributions />
            </RoleRoute>
          }
        />
        <Route
          path="purchase-credit"
          element={
            <RoleRoute roles={['supporter']}>
              <PurchaseCredit />
            </RoleRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;

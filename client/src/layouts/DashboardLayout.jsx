import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { DashboardTopbar } from '../components/dashboard/DashboardTopbar';
import { DashboardSidebar } from '../components/dashboard/DashboardSidebar';
import { Footer } from '../components/Footer';

export const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardTopbar onMenuClick={() => setSidebarOpen((v) => !v)} />
      <div className="mx-auto flex w-full max-w-7xl flex-1">
        <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../Logo';
import { NotificationBell } from '../NotificationBell';

export const DashboardTopbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-20 border-b border-gray-100 bg-white">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="rounded p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
            aria-label="Toggle sidebar"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <Logo to="/" hideTextOnMobile />
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <span className="whitespace-nowrap rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700 sm:px-3 sm:text-sm">
            {user.credits} credits
          </span>
          <NotificationBell />
          <div className="flex items-center gap-2">
            <img src={user.profilePictureUrl} alt={user.name} className="h-9 w-9 rounded-full object-cover" />
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-gray-800">{user.name}</p>
              <p className="text-xs capitalize text-gray-400">{user.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-gray-500 hover:text-brand-600"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DASHBOARD_NAV } from '../../utils/constants';

const linkClass = ({ isActive }) =>
  `block rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
    isActive ? 'bg-brand-50 text-brand-700' : 'text-gray-600 hover:bg-gray-50'
  }`;

export const DashboardSidebar = ({ open, onClose }) => {
  const { user } = useAuth();
  const items = DASHBOARD_NAV[user.role] || [];

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-30 bg-gray-900/40 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-gray-100 bg-white pt-20 transition-transform lg:static lg:z-0 lg:translate-x-0 lg:pt-6 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="space-y-1 px-4">
          {items.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass} onClick={onClose}>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Logo } from './Logo';
import { NotificationBell } from './NotificationBell';
import { GITHUB_REPO_URL } from '../utils/constants';

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors hover:text-brand-600 ${
    isActive ? 'text-brand-700' : 'text-gray-600'
  }`;

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Logo />

        <button
          className="md:hidden rounded p-2 text-gray-600"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <div className="hidden md:flex md:items-center md:gap-6">
          <NavLink to="/explore-campaigns" className={navLinkClass}>
            Explore Campaigns
          </NavLink>

          {user ? (
            <>
              <NavLink to="/dashboard" className={navLinkClass}>
                Dashboard
              </NavLink>
              <span className="rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-700">
                {user.credits} credits
              </span>
              <NotificationBell />
              <div className="flex items-center gap-2">
                <img
                  src={user.profilePictureUrl}
                  alt={user.name}
                  className="h-8 w-8 rounded-full object-cover"
                />
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-gray-600 hover:text-brand-600"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navLinkClass}>
                Login
              </NavLink>
              <Link
                to="/register"
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"
              >
                Register
              </Link>
            </>
          )}

          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-gray-500 hover:text-brand-600"
          >
            Join as Developer
          </a>
        </div>
      </nav>

      {menuOpen && (
        <div className="border-t border-gray-100 px-4 pb-4 md:hidden">
          <div className="flex flex-col gap-3 pt-3">
            <NavLink to="/explore-campaigns" className={navLinkClass} onClick={() => setMenuOpen(false)}>
              Explore Campaigns
            </NavLink>
            {user ? (
              <>
                <NavLink to="/dashboard" className={navLinkClass} onClick={() => setMenuOpen(false)}>
                  Dashboard
                </NavLink>
                <span className="text-sm font-semibold text-brand-700">{user.credits} credits</span>
                <button onClick={handleLogout} className="text-left text-sm font-medium text-gray-600">
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={navLinkClass} onClick={() => setMenuOpen(false)}>
                  Login
                </NavLink>
                <NavLink to="/register" className={navLinkClass} onClick={() => setMenuOpen(false)}>
                  Register
                </NavLink>
              </>
            )}
            <a href={GITHUB_REPO_URL} target="_blank" rel="noreferrer" className="text-sm text-gray-500">
              Join as Developer
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

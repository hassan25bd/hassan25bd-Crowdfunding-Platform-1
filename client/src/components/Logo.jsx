import { Link } from 'react-router-dom';
import { SITE_NAME } from '../utils/constants';

export const Logo = ({ to = '/', className = '', hideTextOnMobile = false }) => (
  <Link to={to} className={`flex items-center gap-2 ${className}`}>
    <svg width="30" height="30" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="#059669" />
      <path
        d="M16 7c-4.5 0-8 3.2-8 7.6 0 3.2 2.1 5.7 5.1 6.8L12 25l4-2.3 4 2.3-1.1-3.6c3-1.1 5.1-3.6 5.1-6.8C24 10.2 20.5 7 16 7Z"
        fill="white"
      />
    </svg>
    <span
      className={`font-bold text-xl text-brand-800 ${hideTextOnMobile ? 'hidden sm:inline' : ''}`}
    >
      {SITE_NAME}
    </span>
  </Link>
);

import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const HOME_BY_ROLE = {
  supporter: '/dashboard/supporter-home',
  creator: '/dashboard/creator-home',
  admin: '/dashboard/admin-home',
};

export const DashboardIndex = () => {
  const { user } = useAuth();
  return <Navigate to={HOME_BY_ROLE[user.role] || '/'} replace />;
};

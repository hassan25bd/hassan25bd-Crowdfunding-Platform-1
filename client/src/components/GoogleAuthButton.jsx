import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../api/axios';
import { useAuth } from '../context/AuthContext';

export const GoogleAuthButton = ({ role }) => {
  const buttonRef = useRef(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const handleCredentialResponse = async (response) => {
      try {
        const { data } = await api.post('/auth/google', { idToken: response.credential, role });
        login(data.token, data.user);
        toast.success(`Welcome, ${data.user.name}!`);
        navigate('/dashboard');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Google sign-in failed');
      }
    };

    const renderButton = () => {
      if (cancelled || !window.google?.accounts?.id || !buttonRef.current) return;
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: 'outline',
        size: 'large',
        width: 340,
      });
    };

    if (window.google?.accounts?.id) {
      renderButton();
    } else {
      const interval = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(interval);
          renderButton();
        }
      }, 150);
      return () => {
        cancelled = true;
        clearInterval(interval);
      };
    }
  }, [role, login, navigate]);

  return <div ref={buttonRef} className="flex justify-center" />;
};

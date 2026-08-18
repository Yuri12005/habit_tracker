import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from '../api';
import { REFRESH_TOKEN, ACCESS_TOKEN } from '../constants';
import { useState, useEffect, ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    try {
      const res = await api.post('/api/token/refresh/', {
        refresh: refreshToken,
      });
      if (res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        setIsAuthorized(true);
      } else {
        localStorage.clear();
        setIsAuthorized(false);
      }
    } catch (error) {
      console.log(error);
      localStorage.clear();
      setIsAuthorized(false);
    }
  };

  const auth = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      localStorage.clear();
      setIsAuthorized(false);
      return;
    }

    const decoded = jwtDecode(token);
    const tokenExpiration = decoded.exp;
    const now = Date.now() / 1000;

    if (!tokenExpiration || tokenExpiration < now) {
      await refreshToken();
    } else {
      setIsAuthorized(true);
    }
  };

  useEffect(() => {
    auth().catch(() => {
      localStorage.clear();
      setIsAuthorized(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }

  return isAuthorized ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;

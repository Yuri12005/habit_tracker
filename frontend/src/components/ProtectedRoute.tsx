import { Navigate } from 'react-router-dom';
import { useState, useEffect, ReactNode } from 'react';
import { verifyAuth } from '../services/auth.service';

interface ProtectedRouteProps {
  children: ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    verifyAuth().then((isValid) => setIsAuthorized(isValid));
  }, []);

  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }

  return isAuthorized ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;

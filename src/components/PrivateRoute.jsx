// src/components/PrivateRoute.jsx
import React, { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useLocation } from 'react-router-dom';

export default function PrivateRoute({ children }) {
  const { isAuthenticated, isPending, login } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!isPending && !isAuthenticated && typeof login === 'function') {
      login(location.pathname);
    }
  }, [isPending, isAuthenticated, login, location]);

  if (isPending) {
    return <div className="text-center mt-5">Cargando autenticación…</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

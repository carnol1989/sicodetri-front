// src/views/CallbackPage.jsx
import React, { useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useLocation, Navigate } from 'react-router-dom';

export default function CallbackPage() {
  const { isAuthenticated, error } = useAuth();
  const location = useLocation();

  const hasCode = useMemo(() => {
    const qs = new URLSearchParams(location.search);
    return !!qs.get('code');
  }, [location.search]);

  if (!hasCode && !isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (error) return <div>Error de autenticación: {error.message}</div>;
  return isAuthenticated ? <Navigate to="/" replace /> : <div>Procesando callback…</div>;
}

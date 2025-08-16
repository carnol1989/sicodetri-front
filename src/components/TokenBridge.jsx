// src/components/TokenBridge.jsx
import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function TokenBridge() {
  const { token, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && token) {
      sessionStorage.setItem('pkce_token', token);
    } else {
      sessionStorage.removeItem('pkce_token');
    }
  }, [isAuthenticated, token]);

  return null;
}

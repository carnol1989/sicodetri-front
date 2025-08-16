// src/hooks/useAuth.js
import { useContext, useMemo } from 'react';
import { AuthContext } from 'react-oauth2-code-pkce';

export function useAuth() {
  const ctx = useContext(AuthContext);
  return useMemo(
    () => ({
      token: ctx?.token || null,
      idToken: ctx?.idToken || null,
      idTokenData: ctx?.idTokenData || null,
      isAuthenticated: !!ctx?.token,
      isPending: !!ctx?.loginInProgress,
      login: ctx?.logIn, // <-- esta es la “authorize” real
      logout: ctx?.logOut,
      error: ctx?.error || null,
    }),
    [ctx],
  );
}

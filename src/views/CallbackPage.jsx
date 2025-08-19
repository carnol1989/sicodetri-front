/**
 * Callback page for handling OAuth2 PKCE login responses in SICODETRI-FRONT. <br/>
 * Evaluates the `code` parameter returned by the authorization server, checks authentication state,
 * and redirects accordingly. Displays intermediate or error messages during the login flow. <br/>
 * Path: src/views/CallbackPage.jsx
 *
 * @module CallbackPage
 * @requires module: react
 * @requires module:../hooks/useAuth
 * @requires module: react-router-dom
 *
 * <b>Component</b>: {@link CallbackPage} <br/>
 * <b>Copyright</b>: &copy; 2024 EPS Grau. <br/>
 * <b>Company</b>: EPS Grau. <br/>
 *
 * @author EPS Grau
 * <br/>
 * <u>Service Provider</u>: Consultor TI <br/>
 * <u>Developed by</u>: <br/>
 * <ul>
 *   <li>Carlos Augusto Nole Machaca</li>
 * </ul>
 * <u>Changes</u>: <br/>
 * <ul>
 *   <li>Jun 06, 2025 (JSX) Component creation.</li>
 * </ul>
 *
 * @version 1.0
 */
import React, { useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useLocation, Navigate } from 'react-router-dom';

/**
 * CallbackPage component. <br/>
 * Handles the redirect URI after OAuth2 PKCE login attempt. <br/>
 *
 * Logic:
 * - Extracts the `code` parameter from the query string using {@link useLocation}. <br/>
 * - If no `code` is present and user is not authenticated, redirects to `/`. <br/>
 * - If an authentication error exists, shows the error message. <br/>
 * - If authenticated, redirects to `/`. <br/>
 * - Otherwise, shows a "Processing callback..." message while login completes. <br/>
 *
 * @function CallbackPage
 * @returns {JSX.Element} Rendered page depending on authentication state and query params.
 *
 * @example
 * // Route definition
 * <Route path="/callback" element={<CallbackPage />} />
 */
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

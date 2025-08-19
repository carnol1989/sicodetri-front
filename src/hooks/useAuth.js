/**
 * Authentication hook for SICODETRI-FRONT. <br/>
 * Provides a wrapper around the {@link AuthContext} from `react-oauth2-code-pkce`
 * to expose authentication state, tokens, and helper methods to the application. <br/>
 * Path: src/hooks/useAuth.js
 *
 * @module useAuth
 * @requires module: react
 * @requires module: react-oauth2-code-pkce
 *
 * <b>Hook</b>: {@link useAuth} <br/>
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
 *   <li>Jun 06, 2025 (JS) Hook creation.</li>
 * </ul>
 *
 * @version 1.0
 */
import { useContext, useMemo } from 'react';
import { AuthContext } from 'react-oauth2-code-pkce';

/**
 * Authentication context values exposed to components.
 *
 * @typedef {Object} AuthState
 * @property {?string} token - The OAuth2 access token.
 * @property {?string} idToken - The ID token (JWT).
 * @property {?Object} idTokenData - Decoded ID token payload.
 * @property {boolean} isAuthenticated - Whether the user is authenticated.
 * @property {boolean} isPending - Whether a login process is currently in progress.
 * @property {function} login - Function to trigger OAuth2 login flow.
 * @property {function} logout - Function to log out the user.
 * @property {?Error} error - Error object if authentication failed.
 */

/**
 * React hook that provides authentication state and helpers. <br/>
 * - Wraps {@link AuthContext} values from `react-oauth2-code-pkce`. <br/>
 * - Exposes tokens, decoded ID token, authentication flags, and login/logout functions. <br/>
 *
 * @function useAuth
 * @returns {AuthState} Object containing authentication state and actions.
 *
 * @example
 * import { useAuth } from '../hooks/useAuth';
 *
 * function Dashboard() {
 *   const { isAuthenticated, login, logout, token } = useAuth();
 *
 *   if (!isAuthenticated) {
 *     return <button onClick={login}>Login</button>;
 *   }
 *
 *   return (
 *     <div>
 *       <p>Token: {token}</p>
 *       <button onClick={logout}>Logout</button>
 *     </div>
 *   );
 * }
 */
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

/**
 * TokenBridge component for SICODETRI-FRONT. <br/>
 * Responsible for synchronizing the authentication token with `sessionStorage`. <br/>
 *
 * Behavior: <br/>
 * <ul>
 *   <li>Obtains authentication state and token from {@link useAuth}.</li>
 *   <li>If the user is authenticated and a token is available, stores it in `sessionStorage` with the key <b>pkce_token</b>.</li>
 *   <li>If not authenticated, ensures the key <b>pkce_token</b> is removed from `sessionStorage`.</li>
 *   <li>Does not render any UI element; this component is purely functional.</li>
 * </ul>
 * Path: src/components/TokenBridge.jsx
 *
 * <b>Component</b>: {@link TokenBridge} <br/>
 * <b>Company</b>: EPS Grau <br/>
 * <b>Copyright</b>: &copy; 2024 EPS Grau. <br/>
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
 *
 * @module TokenBridge
 * @requires module: react
 * @requires module:../hooks/useAuth
 */
import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

/**
 * Functional component that bridges authentication state with browser session storage. <br/>
 * Ensures that the OAuth2 PKCE token is persisted in `sessionStorage` when authenticated,
 * and removed when authentication state is lost.
 *
 * @function
 * @returns {null} Este componente no renderiza nada en el DOM.
 *
 * @example
 * import TokenBridge from './TokenBridge';
 *
 * function App() {
 *   return (
 *     <>
 *       <TokenBridge />
 *       <MainRouter />
 *     </>
 *   );
 * }
 */
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

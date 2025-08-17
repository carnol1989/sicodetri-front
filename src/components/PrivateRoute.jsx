/**
 * PrivateRoute component for SICODETRI-FRONT. <br/>
 * Ensures that only authenticated users can access certain routes in the application. <br/>
 *
 * Behavior: <br/>
 * <ul>
 *   <li>If authentication is pending, displays a loading message.</li>
 *   <li>If user is not authenticated, automatically triggers the {@link useAuth.login} function, redirecting to the login flow.</li>
 *   <li>If user is authenticated, renders the protected child components.</li>
 * </ul>
 * Path: src/components/PrivateRoute.jsx
 *
 * @module PrivateRoute
 * @requires module: react
 * @requires module:../hooks/useAuth
 * @requires module: react-router-dom
 *
 * <b>Component</b>: {@link PrivateRoute} <br/>
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
 */
import React, { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useLocation } from 'react-router-dom';

/**
 * Restricts access to authenticated users only. <br/>
 * If authentication is in progress, shows a loading indicator. <br/>
 * If not authenticated, triggers login process. <br/>
 *
 * @function
 * @param {Object} props - React component props.
 * @param {React.ReactNode} props.children - The child components to render when user is authenticated.
 * @returns {JSX.Element|null} A loader, `null` (while redirecting), or the protected content.
 *
 * @example
 * import PrivateRoute from '../components/PrivateRoute';
 * import Dashboard from '../views/Dashboard';
 *
 * <Routes>
 *   <Route
 *     path="/dashboard"
 *     element={
 *       <PrivateRoute>
 *         <Dashboard />
 *       </PrivateRoute>
 *     }
 *   />
 * </Routes>
 */
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

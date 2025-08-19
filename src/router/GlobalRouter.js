/**
 * Global router configuration for SICODETRI-FRONT. <br/>
 * Defines application routes, integrates authentication checks via {@link PrivateRoute},
 * and mounts top-level navigation through {@link NavBar}. <br/>
 * Path: src/router/GlobalRouter.js
 *
 * @module GlobalRouter
 * @requires module: react
 * @requires module: react-router-dom
 * @requires module:../hooks/useAuth
 * @requires module:../components/NavBar
 * @requires module:../components/PrivateRoute
 * @requires module:../views/CallbackPage
 * @requires module:../views/Home
 * @requires module:../views/FileUpload
 * @requires module:../views/TemporaryDeductions
 * @requires module:../views/TemporaryAdditions
 * @requires module:../views/PermanentAdditions
 * @requires module:../views/ReportTaxBook
 * @requires module:../views/ReportDetailDepreciation
 * @requires module:../views/ErrorPage
 *
 * <b>Component</b>: {@link AppRouter} <br/>
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
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

import NavBar from '../components/NavBar';
import PrivateRoute from '../components/PrivateRoute';

import CallbackPage from '../views/CallbackPage';
import Home from '../views/Home';
import FileUpload from '../views/FileUpload';
import TemporaryDeductions from '../views/TemporaryDeductions';
import TemporaryAdditions from '../views/TemporaryAdditions';
import PermanentAdditions from '../views/PermanentAdditions';
import ReportTaxBook from '../views/ReportTaxBook';
import ReportDetailDepreciation from '../views/ReportDetailDepreciation';

import ErrorPage from '../views/ErrorPage';

/**
 * AppRouter component. <br/>
 * - Wraps the application inside {@link BrowserRouter}. <br/>
 * - Renders {@link NavBar} globally. <br/>
 * - Defines secure and public routes:
 *   - `/callback`: OAuth2 callback page.
 *   - `/error`: Error handler page.
 *   - `/`: Home (protected by {@link PrivateRoute}).
 *   - `/upload`: File upload (protected).
 *   - `/temporary-deduction`: Temporary deductions (protected).
 *   - `/temporary-addition`: Temporary additions (protected).
 *   - `/permanent-addition`: Permanent additions (protected).
 *   - `/report-tax-book`: Tax book report (protected).
 *   - `/report-detail-depreciation`: Detailed depreciation report (protected).
 *   - `*`: Any unknown path redirects to `/`.
 * - Shows a loading state if authentication is still pending. <br/>
 *
 * @function AppRouter
 * @returns {JSX.Element} Rendered router with all application routes.
 *
 * @example
 * import AppRouter from './router/GlobalRouter';
 *
 * function App() {
 *   return <AppRouter />;
 * }
 */
export default function AppRouter() {
  const { isPending } = useAuth();

  if (isPending) return <div>Cargando aplicación…</div>;

  return (
    <>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/callback" element={<CallbackPage />} />
          <Route path="/error" element={<ErrorPage />} />

          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />

          <Route
            path="/upload"
            element={
              <PrivateRoute>
                <FileUpload />
              </PrivateRoute>
            }
          />

          <Route
            path="/temporary-deduction"
            element={
              <PrivateRoute>
                <TemporaryDeductions />
              </PrivateRoute>
            }
          />

          <Route
            path="/temporary-addition"
            element={
              <PrivateRoute>
                <TemporaryAdditions />
              </PrivateRoute>
            }
          />

          <Route
            path="/permanent-addition"
            element={
              <PrivateRoute>
                <PermanentAdditions />
              </PrivateRoute>
            }
          />

          <Route
            path="/report-tax-book"
            element={
              <PrivateRoute>
                <ReportTaxBook />
              </PrivateRoute>
            }
          />

          <Route
            path="/report-detail-depreciation"
            element={
              <PrivateRoute>
                <ReportDetailDepreciation />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

/**
 * Error page component for SICODETRI-FRONT. <br/>
 * Displays error details passed through query parameters (`status`, `path`, `message`)
 * and provides navigation options for the user to retry or return to the home page. <br/>
 * Path: src/views/ErrorPage.jsx
 *
 * @module ErrorPage
 * @requires module: react
 * @requires module: react-router-dom
 *
 * <b>Component</b>: {@link ErrorPage} <br/>
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
import { useLocation, Link } from 'react-router-dom';

/**
 * Custom hook to parse query string parameters from the current location. <br/>
 * Uses {@link useLocation} to extract the search string and returns a `URLSearchParams` instance.
 *
 * @function useQuery
 * @returns {URLSearchParams} Parsed query string parameters.
 *
 * @example
 * const q = useQuery();
 * const status = q.get('status');
 */
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

/**
 * ErrorPage component. <br/>
 * - Reads query parameters (`status`, `path`, `message`) via {@link useQuery}. <br/>
 * - Displays an error message, status code, and affected path if available. <br/>
 * - Provides navigation options to go back to home (`/`) or retry by reloading the page. <br/>
 *
 * @function ErrorPage
 * @returns {JSX.Element} Rendered error page with status details and user actions.
 *
 * @example
 * // Route definition
 * <Route path="/error" element={<ErrorPage />} />
 *
 * // Example URL:
 * // http://localhost:3000/error?status=401&path=/api/data&message=Unauthorized
 */
export default function ErrorPage() {
  const q = useQuery();
  const status = q.get('status') || '500';
  const path = q.get('path') || '';
  const message = q.get('message') || 'Ha ocurrido un error inesperado.';

  return (
    <div className="container mt-5 pt-5">
      <h1 className="display-6">Ups… algo salió mal</h1>
      <p className="text-muted mb-1">
        Código de estado: <strong>{status}</strong>
      </p>
      {path && (
        <p className="text-muted">
          Ruta: <code>{path}</code>
        </p>
      )}
      <p className="mt-3">{message}</p>
      <div className="mt-4 d-flex gap-2">
        <Link to="/" className="btn btn-primary">
          Volver al inicio
        </Link>
        <button className="btn btn-outline-secondary" onClick={() => window.location.reload()}>
          Reintentar
        </button>
      </div>
    </div>
  );
}

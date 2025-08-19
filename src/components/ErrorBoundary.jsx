/**
 * Error boundary component for SICODETRI-FRONT. <br/>
 * Provides a wrapper that catches JavaScript errors in child components and displays
 * a fallback UI instead of breaking the entire application. <br/>
 * Implements React lifecycle methods {@link getDerivedStateFromError} and {@link componentDidCatch}
 * to handle errors gracefully. <br/>
 * Path: src/components/ErrorBoundary.jsx
 *
 * @module ErrorBoundary
 * @requires module: react
 *
 * <b>Component</b>: {@link ErrorBoundary} <br/>
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

/**
 * ErrorBoundary component. <br/>
 * Captures errors in descendant components and renders a fallback UI with:
 * - A descriptive error message.
 * - A button to reload the application. <br/>
 *
 * Optionally, errors can be reported to monitoring services (e.g., Sentry). <br/>
 *
 * @class
 * @extends React.Component
 *
 * @property {boolean} state.hasError - Indicates if an error has been caught.
 * @property {string} state.errorMsg - Message of the caught error.
 *
 * @example
 * import ErrorBoundary from '../components/ErrorBoundary';
 *
 * function App() {
 *   return (
 *     <ErrorBoundary>
 *       <MyComponent />
 *     </ErrorBoundary>
 *   );
 * }
 */
export default class ErrorBoundary extends React.Component {
  /**
   * @constructor
   * @param {Object} props - Component props.
   */
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMsg: '' };
  }

  /**
   * Lifecycle method that updates state after an error is thrown in a child component.
   *
   * @static
   * @param {Error} error - The error object thrown.
   * @returns {{hasError: boolean, errorMsg: string}} Updated state.
   */
  static getDerivedStateFromError(error) {
    return { hasError: true, errorMsg: error?.message || 'Error desconocido' };
  }

  /**
   * Lifecycle method for logging or reporting errors.
   *
   * @param {Error} error - The error object.
   * @param {Object} info - React component stack info.
   * @returns {void} */
  componentDidCatch(error, info) {
    // Aquí podrías reportar a un servicio (Sentry, etc.)
    console.error(error, info);
  }

  /**
   * Renders the fallback UI when an error is caught,
   * otherwise renders the children components.
   *
   * @returns {JSX.Element} Error message UI or child components.
   */
  render() {
    if (this.state.hasError) {
      return (
        <div className="container mt-5 pt-5">
          <h2>La aplicación encontró un problema</h2>
          <pre className="bg-light p-3 rounded">{this.state.errorMsg}</pre>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Recargar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

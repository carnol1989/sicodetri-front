import React from 'react';
import './styles/styles.css';
import './styles/sticky-footer-navbar.css';
import { FixedAssetContext } from './context/FixedAssetContext';
import TokenBridge from './components/TokenBridge';
import Footer from './components/Footer';
import GlobalRouter from './router/GlobalRouter';
import ErrorBoundary from './components/ErrorBoundary';

/**
 * @fileoverview Root application component for SICODETRI-FRONT.
 * Provides global context for fixed assets, mounts the routing layer,
 * and wraps the UI with an error boundary and cross-context token bridge.
 * Path: src/App.js
 *
 * @module App
 * @requires React
 * @requires module:./context/FixedAssetContext
 * @requires module:./components/TokenBridge
 * @requires module:./router/GlobalRouter
 * @requires module:./components/Footer
 * @requires module:./components/ErrorBoundary
 *
 * <b>Component</b>: {@link App} <br/>
 * <b>Copyright</b>: &copy; 2024 EPS Grau. <br/>
 * <b>Company</b>: EPS Grau. <br/>
 *
 * @author EPS Grau
 * <br/>
 * <u>Service Provider</u>: Consultor TI <br/>
 * <u>Developed by</u>: <br/>
 * <ul>
 * <li>Carlos Augusto Nole Machaca</li>
 * </ul>
 * <u>Changes</u>: <br/>
 * <ul>
 * <li>Jun 06, 2025 (JSX) Component creation.</li>
 * </ul>
 *
 * @version 1.0
 */

/**
 * A fixed asset item.
 * Extend this shape as needed in the project (e.g., id, accountCode, amounts).
 * @typedef {Object<string, any>} FixedAsset
 */

/**
 * Value provided through {@link FixedAssetContext}.
 * @typedef FixedAssetContextValue
 * @property {FixedAsset[]} fixedAssetList - In-memory list used across views/components.
 */

/**
 * Root React component of the application.
 *
 * Responsibilities:
 * - Initializes and provides {@link FixedAssetContext} with a default value.
 * - Bridges authentication/authorization tokens across app layers via {@link TokenBridge}.
 * - Renders the application router {@link GlobalRouter}.
 * - Displays a global {@link Footer}.
 * - Guards the entire tree with {@link ErrorBoundary} to catch render-time errors.
 *
 * @function App
 * @returns {JSX.Element} The application root element.
 *
 * @example
 * // index.js
 * import React from 'react';
 * import { createRoot } from 'react-dom/client';
 * import App from './App';
 *
 * createRoot(document.getElementById('root')).render(<App />);
 *
 * @see FixedAssetContext
 * @see TokenBridge
 * @see GlobalRouter
 * @see Footer
 * @see ErrorBoundary
 */
function App() {
  const fixedAssetList = [];
  return (
    <div>
      <ErrorBoundary>
        <FixedAssetContext.Provider value={{ fixedAssetList }}>
          <TokenBridge />
          <GlobalRouter></GlobalRouter>
          <Footer />
        </FixedAssetContext.Provider>
      </ErrorBoundary>
    </div>
  );
}

export default App;

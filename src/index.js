/**
 * Entry point of the SICODETRI-FRONT React application. <br/>
 * Initializes the application root, configures OAuth2 PKCE authentication, and
 * mounts the {@link App} component into the DOM. <br/>
 * Path: src/index.js
 *
 * @module index
 * @requires module: react
 * @requires module: react-dom/client
 * @requires module: react-oauth2-code-pkce
 * @requires module:./App
 * @requires module:./http-common
 * @requires module: bootstrap/dist/css/bootstrap.min.css
 * @requires module: bootstrap/dist/js/bootstrap.bundle.min.js
 *
 * <b>Component</b>: {@link index} <br/>
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
 *   <li>Jun 06, 2025 (JSX) Entry point creation.</li>
 * </ul>
 *
 * @version 1.0
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider, AuthContext } from 'react-oauth2-code-pkce';
import App from './App';
import { setAuthContextRef } from './http-common';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

/**
 * Authentication configuration for OAuth2 PKCE flow. <br/>
 * Values are loaded from environment variables defined at build time.
 *
 * @constant
 * @type {Object}
 * @property {string} clientId - The OAuth2 client ID.
 * @property {string} authorizationEndpoint - The URL of the authorization server endpoint.
 * @property {string} tokenEndpoint - The URL of the token server endpoint.
 * @property {string} redirectUri - The URI where the authorization server redirects after login.
 * @property {string} scope - Space-delimited list of requested scopes.
 * @property {boolean} autoLogin - If `true`, triggers automatic login at startup.
 */
const authConfig = {
  clientId: process.env.REACT_APP_OAUTH_CLIENT_ID,
  authorizationEndpoint: process.env.REACT_APP_OAUTH_AUTH_URL,
  tokenEndpoint: process.env.REACT_APP_BASE_PATH_BACK + process.env.REACT_APP_OAUTH_TOKEN_PATH,
  redirectUri: process.env.REACT_APP_OAUTH_REDIRECT_URI,
  scope: process.env.REACT_APP_OAUTH_SCOPES,
  autoLogin: false,
};

/**
 * Higher-order component that wraps {@link App} with OAuth2 PKCE authentication. <br/>
 * - Initializes the {@link AuthProvider} with the {@link authConfig}. <br/>
 * - Bridges the authentication context to the Axios client via {@link setAuthContextRef}. <br/>
 *
 * @function WithAuthBridge
 * @returns {JSX.Element} The application wrapped with authentication provider.
 */
function WithAuthBridge() {
  return (
    <AuthProvider authConfig={authConfig}>
      <AuthContext.Consumer>
        {(auth) => {
          setAuthContextRef(auth);
          return <App />;
        }}
      </AuthContext.Consumer>
    </AuthProvider>
  );
}

/**
 * Bootstraps the React application. <br/>
 * Mounts the {@link WithAuthBridge} component into the DOM element with ID `root`.
 */
ReactDOM.createRoot(document.getElementById('root')).render(<WithAuthBridge />);

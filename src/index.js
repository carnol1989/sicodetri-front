// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider, AuthContext } from 'react-oauth2-code-pkce';
import App from './App';
import { setAuthContextRef } from './http-common';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const authConfig = {
  clientId: process.env.REACT_APP_OAUTH_CLIENT_ID,
  authorizationEndpoint: process.env.REACT_APP_OAUTH_AUTH_URL,
  tokenEndpoint: process.env.REACT_APP_BASE_PATH_BACK + process.env.REACT_APP_OAUTH_TOKEN_PATH,
  redirectUri: process.env.REACT_APP_OAUTH_REDIRECT_URI,
  scope: process.env.REACT_APP_OAUTH_SCOPES,
  autoLogin: false,
};

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

ReactDOM.createRoot(document.getElementById('root')).render(<WithAuthBridge />);

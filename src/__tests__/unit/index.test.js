// src/__tests__/unit/index.test.js
/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';

describe('index.js', () => {
  let createRootMock;
  let renderMock;

  beforeEach(() => {
    jest.resetModules();

    // Preparamos el nodo root del DOM
    document.body.innerHTML = '<div id="root"></div>';

    // Variables de entorno para construir authConfig
    process.env.REACT_APP_OAUTH_CLIENT_ID = 'CID';
    process.env.REACT_APP_OAUTH_AUTH_URL = 'https://auth.example.com/authorize';
    process.env.REACT_APP_BASE_PATH_BACK = 'https://api.example.com';
    process.env.REACT_APP_OAUTH_TOKEN_PATH = '/oauth/token';
    process.env.REACT_APP_OAUTH_REDIRECT_URI = 'https://app.example.com/callback';
    process.env.REACT_APP_OAUTH_SCOPES = 'openid profile email';

    // Mocks de CSS/Bootstrap para evitar errores de import
    jest.doMock('bootstrap/dist/css/bootstrap.min.css', () => ({}), { virtual: true });
    jest.doMock('bootstrap/dist/js/bootstrap.bundle.min.js', () => ({}), { virtual: true });

    // Mock de App
    jest.doMock('../../App', () => {
      const React = require('react');
      return {
        __esModule: true,
        default: () => <div data-testid="app">Mock App</div>,
      };
    });

    // Mock de http-common -> setAuthContextRef
    jest.doMock('../../http-common', () => {
      return {
        __esModule: true,
        setAuthContextRef: jest.fn(),
      };
    });

    // Mock de react-oauth2-code-pkce
    jest.doMock('react-oauth2-code-pkce', () => {
      const React = require('react');
      const AuthContext = React.createContext(undefined);

      // guardamos el último authConfig pasado al provider
      let lastAuthConfig;
      const providedAuth = { token: 'XYZ', logIn: jest.fn(), logOut: jest.fn() };

      const AuthProvider = ({ authConfig, children }) => {
        lastAuthConfig = authConfig;
        return <AuthContext.Provider value={providedAuth}>{children}</AuthContext.Provider>;
      };

      // Exponemos helpers para que el test pueda leerlos
      return {
        __esModule: true,
        AuthContext,
        AuthProvider,
        __test__: {
          getLastAuthConfig: () => lastAuthConfig,
          getProvidedAuth: () => providedAuth,
        },
      };
    });

    // Mock de react-dom/client
    jest.doMock('react-dom/client', () => {
      renderMock = jest.fn();
      createRootMock = jest.fn(() => ({ render: renderMock }));
      return {
        __esModule: true,
        default: { createRoot: createRootMock },
        createRoot: createRootMock,
        renderMock,
      };
    });
  });

  it('crea el root, renderiza <WithAuthBridge />, pasa authConfig correcto y llama setAuthContextRef con el auth del contexto', async () => {
    // 1) Cargamos index.js DESPUÉS de definir todos los mocks
    require('../../index');

    // 2) Aserciones sobre createRoot/render
    const { createRoot, renderMock: rm } = require('react-dom/client');
    const rootNode = document.getElementById('root');
    expect(createRoot).toHaveBeenCalledWith(rootNode);
    expect(rm).toHaveBeenCalledTimes(1);

    // 3) El elemento que se pasó a render es <WithAuthBridge />
    const withAuthBridgeEl = rm.mock.calls[0][0];
    expect(withAuthBridgeEl).toBeTruthy();

    // 4) Montamos ese elemento para que se ejecute el Provider/Consumer
    render(withAuthBridgeEl);

    // 5) Verificamos que App aparece (se renderiza dentro de WithAuthBridge)
    expect(screen.getByTestId('app')).toBeInTheDocument();

    // 6) Verificamos que setAuthContextRef fue llamado con el "auth" del contexto
    const { setAuthContextRef } = require('../../http-common');
    const { __test__ } = require('react-oauth2-code-pkce');
    const providedAuth = __test__.getProvidedAuth();

    expect(setAuthContextRef).toHaveBeenCalledTimes(1);
    expect(setAuthContextRef).toHaveBeenCalledWith(providedAuth);

    // 7) Verificamos que el AuthProvider recibió el authConfig construido desde process.env
    const cfg = __test__.getLastAuthConfig();
    expect(cfg).toEqual({
      clientId: 'CID',
      authorizationEndpoint: 'https://auth.example.com/authorize',
      tokenEndpoint: 'https://api.example.com/oauth/token',
      redirectUri: 'https://app.example.com/callback',
      scope: 'openid profile email',
      autoLogin: false,
    });
  });
});

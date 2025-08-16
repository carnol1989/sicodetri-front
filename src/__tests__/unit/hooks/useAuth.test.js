// src/__tests__/unit/hooks/useAuth.test.js
import React from 'react';
import { render, screen, fireEvent, rerender } from '@testing-library/react';

// 1) Mock del módulo y su AuthContext ANTES de importar useAuth
jest.mock('react-oauth2-code-pkce', () => {
  const React = require('react');
  return {
    // Contexto con default undefined para simular "sin provider"
    AuthContext: React.createContext(undefined),
  };
});

import { AuthContext } from 'react-oauth2-code-pkce';
import { useAuth } from '../../../hooks/useAuth';

// Componente "sonda" para leer y mostrar el resultado del hook
function Probe({ showButtons = true }) {
  const a = useAuth();
  return (
    <div>
      <div data-testid="token">{String(a.token)}</div>
      <div data-testid="idToken">{String(a.idToken)}</div>
      <div data-testid="idTokenData">{JSON.stringify(a.idTokenData)}</div>
      <div data-testid="isAuthenticated">{String(a.isAuthenticated)}</div>
      <div data-testid="isPending">{String(a.isPending)}</div>
      <div data-testid="error">{String(a.error)}</div>

      {showButtons && (
        <>
          {/* Botones solo si existen handlers, para poder clickear en el test 1 */}
          <button
            onClick={a.login}
            disabled={!a.login}
            aria-label="login-btn"
          >
            login
          </button>
          <button
            onClick={a.logout}
            disabled={!a.logout}
            aria-label="logout-btn"
          >
            logout
          </button>
        </>
      )}
    </div>
  );
}

describe('useAuth', () => {
  it('devuelve valores mapeados desde el contexto y permite invocar login/logout', () => {
    const logIn = jest.fn();
    const logOut = jest.fn();
    const value = {
      token: 'tok',
      idToken: 'idt',
      idTokenData: { sub: '123', name: 'Alice' },
      loginInProgress: true,
      logIn,
      logOut,
      error: 'oops',
    };

    render(
      <AuthContext.Provider value={value}>
        <Probe />
      </AuthContext.Provider>
    );

    expect(screen.getByTestId('token')).toHaveTextContent('tok');
    expect(screen.getByTestId('idToken')).toHaveTextContent('idt');
    expect(screen.getByTestId('idTokenData')).toHaveTextContent(
      JSON.stringify({ sub: '123', name: 'Alice' })
    );
    expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('true');
    expect(screen.getByTestId('isPending')).toHaveTextContent('true');
    expect(screen.getByTestId('error')).toHaveTextContent('oops');

    // login/logout disponibles y funcionan
    const loginBtn = screen.getByLabelText('login-btn');
    const logoutBtn = screen.getByLabelText('logout-btn');
    expect(loginBtn).not.toBeDisabled();
    expect(logoutBtn).not.toBeDisabled();

    fireEvent.click(loginBtn);
    fireEvent.click(logoutBtn);

    expect(logIn).toHaveBeenCalledTimes(1);
    expect(logOut).toHaveBeenCalledTimes(1);
  });

  it('retorna defaults seguros cuando no hay Provider (ctx undefined)', () => {
    render(<Probe showButtons={false} />);

    expect(screen.getByTestId('token')).toHaveTextContent('null');
    expect(screen.getByTestId('idToken')).toHaveTextContent('null');
    expect(screen.getByTestId('idTokenData')).toHaveTextContent('null');
    expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false');
    expect(screen.getByTestId('isPending')).toHaveTextContent('false');
    expect(screen.getByTestId('error')).toHaveTextContent('null');
  });

  it('recalcula al cambiar el contexto (dependencia de useMemo en [ctx])', () => {
    const value1 = {
      token: 'A',
      idToken: 'IA',
      idTokenData: { n: 1 },
      loginInProgress: false,
      logIn: jest.fn(),
      logOut: jest.fn(),
      error: null,
    };

    const { rerender } = render(
      <AuthContext.Provider value={value1}>
        <Probe />
      </AuthContext.Provider>
    );

    expect(screen.getByTestId('token')).toHaveTextContent('A');
    expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('true'); // !!token => true
    expect(screen.getByTestId('isPending')).toHaveTextContent('false');

    const value2 = {
      token: '', // falsy: el hook lo convertirá a null
      idToken: 'IB',
      idTokenData: { n: 2 },
      loginInProgress: true,
      logIn: jest.fn(),
      logOut: jest.fn(),
      error: 'E',
    };

    rerender(
      <AuthContext.Provider value={value2}>
        <Probe />
      </AuthContext.Provider>
    );

    // token '' -> hook mapea a null -> String(null) === "null"
    expect(screen.getByTestId('token')).toHaveTextContent('null');
    expect(screen.getByTestId('idToken')).toHaveTextContent('IB');
    expect(screen.getByTestId('idTokenData')).toHaveTextContent(JSON.stringify({ n: 2 }));
    expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false'); // !!'' => false
    expect(screen.getByTestId('isPending')).toHaveTextContent('true');
    expect(screen.getByTestId('error')).toHaveTextContent('E');
  });
});

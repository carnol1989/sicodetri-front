// src/__tests__/unit/App.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../../App';

// Evitamos errores al importar CSS
jest.mock('../../styles/styles.css', () => ({}));
jest.mock('../../styles/sticky-footer-navbar.css', () => ({}));

/**
 * Mock de TokenBridge que CONSUME el FixedAssetContext para verificar
 * que App lo provee correctamente con { fixedAssetList: [] }.
 */
jest.mock('../../components/TokenBridge', () => {
  const React = require('react');
  const { FixedAssetContext } = require('../../context/FixedAssetContext');
  return function TokenBridgeMock() {
    const { fixedAssetList } = React.useContext(FixedAssetContext);
    return (
      <div data-testid="mock-tokenbridge">
        TokenBridge Mock - items:{Array.isArray(fixedAssetList) ? fixedAssetList.length : 'N/A'}
      </div>
    );
  };
});

// Mock de GlobalRouter y Footer para aislar App
jest.mock('../../router/GlobalRouter', () => () => (
  <div data-testid="mock-router">Router Mock</div>
));

jest.mock('../../components/Footer', () => () => (
  <div data-testid="mock-footer">Footer Mockeado</div>
));

/**
 * (Opcional pero útil) Mock del ErrorBoundary que no altera el árbol
 * y nos permite afirmar que App lo usa (envolviendo a los hijos).
 */
jest.mock('../../components/ErrorBoundary', () => {
  return function ErrorBoundaryMock({ children }) {
    return <div data-testid="mock-error-boundary">{children}</div>;
  };
});

describe('App (aislado y con 100% coverage)', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  it('renderiza el árbol completo: ErrorBoundary, Provider, TokenBridge, GlobalRouter y Footer', () => {
    render(<App />);

    // Se montó el ErrorBoundary (mock)
    expect(screen.getByTestId('mock-error-boundary')).toBeInTheDocument();

    // Se montó TokenBridge y leyó el contexto
    const tb = screen.getByTestId('mock-tokenbridge');
    expect(tb).toHaveTextContent('TokenBridge Mock - items:0');

    // Se montó el Router mock
    expect(screen.getByTestId('mock-router')).toHaveTextContent('Router Mock');

    // Se montó el Footer mock
    expect(screen.getByTestId('mock-footer')).toHaveTextContent('Footer Mockeado');
  });

  it('provee un fixedAssetList vacío en el contexto', () => {
    render(<App />);
    // Validación explícita del valor expuesto por el Provider vía el mock de TokenBridge
    expect(screen.getByTestId('mock-tokenbridge')).toHaveTextContent('items:0');
  });

  // (Opcional) snapshot mínimamente estable del árbol aislado.
  it('snapshot del render aislado', () => {
    const { asFragment } = render(<App />);
    expect(asFragment()).toMatchSnapshot();
  });
});

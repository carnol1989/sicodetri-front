// src/__tests__/unit/App.test.js
/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../../App';

// Evitamos errores al importar CSS
jest.mock('../../styles/styles.css', () => ({}));
jest.mock('../../styles/sticky-footer-navbar.css', () => ({}));

// Solo mockeamos Footer; GlobalRouter se monta de verdad.
jest.mock('../../components/Footer', () => () => (
  <div data-testid="mock-footer">Footer Mockeado</div>
));

describe('App (integración con GlobalRouter real)', () => {
  beforeEach(() => {
    document.body.innerHTML = '';  // limpio el DOM
  });

  it('renderiza la marca de la navbar "SICODETRI"', () => {
    render(<App />);
    // Busca el enlace por su rol y nombre accesible
    const brandLink = screen.getByRole('link', { name: /SICODETRI/i });
    expect(brandLink).toBeInTheDocument();
    expect(brandLink).toHaveAttribute('href', '/');
  });

  it('muestra el título principal de la aplicación', () => {
    render(<App />);
    const title = screen.getByRole('heading', {
      name: /Aplicación Web para Conciliación Tributaria y Financiera/i,
    });
    expect(title).toBeInTheDocument();
  });

  it('incluye el Footer mockeado', () => {
    render(<App />);
    expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
  });
});

// src/__tests__/unit/views/CallbackPage.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

// Mock SOLO del hook propio
jest.mock('../../../hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

import { useAuth } from '../../../hooks/useAuth';
import CallbackPage from '../../../views/CallbackPage';

describe('CallbackPage Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithRoutes = (initialEntry) => {
    return render(
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route path="/callback" element={<CallbackPage />} />
          {/* Ruta destino para verificar la redirección */}
          <Route path="/" element={<div data-testid="home">HOME</div>} />
        </Routes>
      </MemoryRouter>,
    );
  };

  it('si NO hay code y NO está autenticado, navega a "/" (replace=true)', () => {
    // hasCode === false (search vacío) y no autenticado
    useAuth.mockReturnValue({ isAuthenticated: false, error: null });

    renderWithRoutes('/callback'); // sin query params -> no hay code

    // Debe terminar en "/"
    expect(screen.getByTestId('home')).toBeInTheDocument();
  });

  it('si hay error de autenticación, muestra el mensaje (con code para evitar early return)', () => {
    useAuth.mockReturnValue({ isAuthenticated: false, error: { message: 'falló login' } });

    renderWithRoutes('/callback?code=abc');

    expect(screen.getByText('Error de autenticación: falló login')).toBeInTheDocument();
    // y no debe haberse redirigido a "/"
    expect(screen.queryByTestId('home')).toBeNull();
  });

  it('si ya está autenticado, navega a "/" (replace=true)', () => {
    useAuth.mockReturnValue({ isAuthenticated: true, error: null });

    renderWithRoutes('/callback');

    expect(screen.getByTestId('home')).toBeInTheDocument();
  });

  it('si hay code y NO está autenticado ni hay error, muestra "Procesando callback…"', () => {
    useAuth.mockReturnValue({ isAuthenticated: false, error: null });

    renderWithRoutes('/callback?code=xyz');

    expect(screen.getByText('Procesando callback…')).toBeInTheDocument();
    expect(screen.queryByTestId('home')).toBeNull();
  });
});

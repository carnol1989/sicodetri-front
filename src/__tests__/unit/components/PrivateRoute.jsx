// src/__tests__/unit/components/PrivateRoute.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';

// 1) Mock de useAuth (del hook propio)
jest.mock('../../../hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

// 2) Mock de useLocation (de react-router-dom)
jest.mock('react-router-dom', () => ({
  useLocation: jest.fn(),
}));

import { useAuth } from '../../../hooks/useAuth';
import { useLocation } from 'react-router-dom';
import PrivateRoute from '../../../components/PrivateRoute';

describe('PrivateRoute Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('muestra loader cuando isPending=true y NO llama a login', () => {
    const login = jest.fn();
    useAuth.mockReturnValue({
      isAuthenticated: false,
      isPending: true,
      login,
    });
    useLocation.mockReturnValue({ pathname: '/secure' });

    render(
      <PrivateRoute>
        <div data-testid="child">child</div>
      </PrivateRoute>
    );

    expect(
      screen.getByText('Cargando autenticación…')
    ).toBeInTheDocument();
    expect(screen.queryByTestId('child')).not.toBeInTheDocument();
    expect(login).not.toHaveBeenCalled();
  });

  it('si no está autenticado y no está pendiente, llama login(pathname) y NO renderiza hijos', () => {
    const login = jest.fn();
    useAuth.mockReturnValue({
      isAuthenticated: false,
      isPending: false,
      login,
    });
    useLocation.mockReturnValue({ pathname: '/mi/ruta' });

    const { container } = render(
      <PrivateRoute>
        <div data-testid="child">child</div>
      </PrivateRoute>
    );

    expect(login).toHaveBeenCalledTimes(1);
    expect(login).toHaveBeenCalledWith('/mi/ruta');
    // retorna null en este estado
    expect(container).toBeEmptyDOMElement();
  });

  it('si está autenticado, renderiza los children y NO llama a login', () => {
    const login = jest.fn();
    useAuth.mockReturnValue({
      isAuthenticated: true,
      isPending: false,
      login,
    });
    useLocation.mockReturnValue({ pathname: '/cualquier' });

    render(
      <PrivateRoute>
        <div data-testid="child">child</div>
      </PrivateRoute>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(login).not.toHaveBeenCalled();
  });

  it('si no está autenticado y login NO es función, no truena y no renderiza hijos', () => {
    useAuth.mockReturnValue({
      isAuthenticated: false,
      isPending: false,
      login: undefined, // o null / valor no-función
    });
    useLocation.mockReturnValue({ pathname: '/otra' });

    const { container } = render(
      <PrivateRoute>
        <div data-testid="child">child</div>
      </PrivateRoute>
    );

    // no explota, no renderiza hijos (retorna null)
    expect(container).toBeEmptyDOMElement();
  });
});

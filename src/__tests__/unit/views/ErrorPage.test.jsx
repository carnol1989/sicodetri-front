// src/__tests__/unit/views/ErrorPage.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock parcial de react-router-dom: conservamos todo menos useLocation
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useLocation: jest.fn(),
  };
});

import { MemoryRouter } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import ErrorPage from '../../../views/ErrorPage';

describe('ErrorPage Test', () => {
  let reloadMock;
  let locationGetterSpy;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock seguro de window.location.reload a través del getter de location
    reloadMock = jest.fn();
    locationGetterSpy = jest.spyOn(window, 'location', 'get').mockReturnValue({
      ...window.location,
      reload: reloadMock,
    });
  });

  afterEach(() => {
    locationGetterSpy.mockRestore();
  });

  it('muestra los datos desde la query y permite reintentar (reload)', () => {
    // useLocation().search con todos los parámetros
    useLocation.mockReturnValue({
      pathname: '/error',
      search: '?status=404&path=%2Fsecured%2Fpage&message=No%20encontrado',
    });

    render(
      <MemoryRouter>
        <ErrorPage />
      </MemoryRouter>,
    );

    // Título
    expect(screen.getByText('Ups… algo salió mal')).toBeInTheDocument();

    // Status
    expect(screen.getByText(/Código de estado:/i)).toBeInTheDocument();
    expect(screen.getByText('404')).toBeInTheDocument();

    // Path (bloque condicional)
    expect(screen.getByText('Ruta:')).toBeInTheDocument();
    expect(screen.getByText('/secured/page')).toBeInTheDocument();

    // Message
    expect(screen.getByText('No encontrado')).toBeInTheDocument();

    // Link a inicio
    const homeLink = screen.getByRole('link', { name: 'Volver al inicio' });
    expect(homeLink).toHaveAttribute('href', '/');

    // Botón Reintentar -> window.location.reload()
    const retryBtn = screen.getByRole('button', { name: 'Reintentar' });
    fireEvent.click(retryBtn);
    expect(reloadMock).toHaveBeenCalledTimes(1);
  });

  it('usa valores por defecto cuando faltan parámetros y no muestra la ruta si no hay path', () => {
    // Solo ?status; los demás faltan -> defaults
    useLocation.mockReturnValue({
      pathname: '/error',
      search: '?status=401',
    });

    render(
      <MemoryRouter>
        <ErrorPage />
      </MemoryRouter>,
    );

    // status tomado de query
    expect(screen.getByText('401')).toBeInTheDocument();

    // path vacío -> NO debe renderizar el bloque "Ruta:"
    expect(screen.queryByText('Ruta:')).toBeNull();

    // message por defecto
    expect(screen.getByText('Ha ocurrido un error inesperado.')).toBeInTheDocument();

    // Link sigue apuntando a inicio
    const homeLink = screen.getByRole('link', { name: 'Volver al inicio' });
    expect(homeLink).toHaveAttribute('href', '/');
  });
});

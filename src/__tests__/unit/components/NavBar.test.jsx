// src/__tests__/unit/components/NavBar.test.jsx
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock del hook useAuth para controlar isAuthenticated / login / logout
jest.mock('../../../hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

import { useAuth } from '../../../hooks/useAuth';
import NavBar from '../../../components/NavBar';

describe('NavBar component Test', () => {
  const OLD_ENV = process.env;
  let fetchMock;

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();

    // Env necesario para el logout fetch
    process.env = { ...OLD_ENV, REACT_APP_BASE_PATH_BACK: 'https://api.example.com' };

    // Mock global fetch: por defecto rechazamos para cubrir el catch de handleLogout
    fetchMock = jest.spyOn(global, 'fetch').mockRejectedValue(new Error('network fail'));

    // Limpia sessionStorage entre tests
    sessionStorage.clear();
  });

  afterEach(() => {
    process.env = OLD_ENV;
    fetchMock.mockRestore();
  });

  const renderNavBar = () =>
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    );

  it('renderiza estructura base: <nav>, brand y toggler', () => {
    // No autenticado para no mostrar Logout
    useAuth.mockReturnValue({ isAuthenticated: false, login: jest.fn(), logout: jest.fn() });

    renderNavBar();

    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
    expect(nav).toHaveClass('navbar', 'navbar-expand-md', 'navbar-dark', 'fixed-top', 'bg-dark');

    const brandLink = screen.getByRole('link', { name: 'SICODETRI' });
    expect(brandLink).toHaveClass('navbar-brand');
    expect(brandLink).toHaveAttribute('href', '/');

    const toggler = screen.getByRole('button', { name: 'Toggle navigation' });
    expect(toggler).toHaveClass('navbar-toggler');
    expect(toggler).toHaveAttribute('data-bs-toggle', 'collapse');
    expect(toggler).toHaveAttribute('data-bs-target', '#navbarCollapse');
    expect(toggler).toHaveAttribute('aria-controls', 'navbarCollapse');
    expect(toggler).toHaveAttribute('aria-expanded', 'false');
  });

  it('renderiza links y dropdowns (Generar Proyección / Reporte) con sus items', () => {
    useAuth.mockReturnValue({ isAuthenticated: false, login: jest.fn(), logout: jest.fn() });

    renderNavBar();

    // Link Cargar Archivo
    const uploadLink = screen.getByRole('link', { name: 'Cargar Archivo' });
    expect(uploadLink).toHaveClass('nav-link');
    expect(uploadLink).toHaveAttribute('href', '/upload');

    // Dropdown Generar Proyección
    const genToggle = screen.getByRole('button', { name: 'Generar Proyección' });
    expect(genToggle).toBeInTheDocument();
    expect(genToggle).toHaveClass('nav-link', 'dropdown-toggle');
    expect(genToggle).toHaveAttribute('id', 'navbarDropdown');

    const dedTemp = screen.getByRole('link', { name: 'Deducciones Temporales' });
    expect(dedTemp).toHaveClass('dropdown-item');
    expect(dedTemp).toHaveAttribute('href', '/temporary-deduction');

    const addTemp = screen.getByRole('link', { name: 'Adiciones Temporales' });
    expect(addTemp).toHaveClass('dropdown-item');
    expect(addTemp).toHaveAttribute('href', '/temporary-addition');

    const addPerm = screen.getByRole('link', { name: 'Adiciones Permanentes' });
    expect(addPerm).toHaveClass('dropdown-item');
    expect(addPerm).toHaveAttribute('href', '/permanent-addition');

    // Dropdown Reporte
    const repToggle = screen.getByRole('button', { name: 'Reporte' });
    expect(repToggle).toBeInTheDocument();
    expect(repToggle).toHaveClass('nav-link', 'dropdown-toggle');

    const taxBook = screen.getByRole('link', { name: 'Libro Tributario de Activo Fijo' });
    expect(taxBook).toHaveClass('dropdown-item');
    expect(taxBook).toHaveAttribute('href', '/report-tax-book');

    const detail = screen.getByRole('link', {
      name: 'Detalle Depreciación Financiera y Tributaria',
    });
    expect(detail).toHaveClass('dropdown-item');
    expect(detail).toHaveAttribute('href', '/report-detail-depreciation');
  });

  it('cuando NO está autenticado muestra botón Login y al click llama a login()', () => {
    const login = jest.fn();
    useAuth.mockReturnValue({ isAuthenticated: false, login, logout: jest.fn() });

    renderNavBar();

    const loginBtn = screen.getByRole('button', { name: 'Login' });
    expect(loginBtn).toBeInTheDocument();

    fireEvent.click(loginBtn);
    expect(login).toHaveBeenCalledTimes(1);

    // No debe mostrarse Logout
    expect(screen.queryByRole('button', { name: 'Logout' })).toBeNull();
  });

  it('cuando SÍ está autenticado muestra Logout y al click hace fetch, borra sessionStorage y llama logout()', async () => {
    const logout = jest.fn();

    sessionStorage.setItem('pkce_token', 'abc123');

    useAuth.mockReturnValue({ isAuthenticated: true, login: jest.fn(), logout });

    renderNavBar();

    const logoutBtn = screen.getByRole('button', { name: 'Logout' });
    expect(logoutBtn).toBeInTheDocument();

    // Dispara el handler
    fireEvent.click(logoutBtn);

    // Espera a que termine el flujo async (await fetch -> catch -> removeItem -> logout)
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(sessionStorage.getItem('pkce_token')).toBeNull();
      expect(logout).toHaveBeenCalledTimes(1);
    });

    // Verifica argumentos de fetch
    expect(fetchMock).toHaveBeenCalledWith('https://api.example.com/logout', {
      method: 'POST',
      credentials: 'include',
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
    });

    expect(screen.queryByRole('button', { name: 'Login' })).toBeNull();
  });
});

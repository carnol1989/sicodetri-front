// src/__tests__/components/NavBar.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NavBar from '../../components/NavBar';

describe('NavBar component', () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>,
    );
  });

  it('renders a <nav> with the correct classes', () => {
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
    expect(nav).toHaveClass('navbar', 'navbar-expand-md', 'navbar-dark', 'fixed-top', 'bg-dark');
  });

  it('renders the brand link pointing to "/" with text SICODETRI', () => {
    const brandLink = screen.getByRole('link', { name: 'SICODETRI' });
    expect(brandLink).toBeInTheDocument();
    expect(brandLink).toHaveClass('navbar-brand');
    expect(brandLink).toHaveAttribute('href', '/');
  });

  it('renders the toggler button with the proper attributes', () => {
    const toggler = screen.getByRole('button', { name: 'Toggle navigation' });
    expect(toggler).toBeInTheDocument();
    expect(toggler).toHaveClass('navbar-toggler');
    expect(toggler).toHaveAttribute('data-bs-toggle', 'collapse');
    expect(toggler).toHaveAttribute('data-bs-target', '#navbarCollapse');
    expect(toggler).toHaveAttribute('aria-controls', 'navbarCollapse');
    expect(toggler).toHaveAttribute('aria-expanded', 'false');
  });

  it('renders the "Cargar Archivo" link', () => {
    const uploadLink = screen.getByRole('link', { name: 'Cargar Archivo' });
    expect(uploadLink).toBeInTheDocument();
    expect(uploadLink).toHaveClass('nav-link');
    expect(uploadLink).toHaveAttribute('href', '/upload');
  });

  it('renders the "Generar Proyeccion" dropdown and its items', () => {
    // Dropdown toggle
    const genToggle = screen.getByRole('button', { name: 'Generar Proyeccion' });
    expect(genToggle).toBeInTheDocument();
    expect(genToggle).toHaveClass('nav-link', 'dropdown-toggle');
    expect(genToggle).toHaveAttribute('id', 'navbarDropdown');

    // Dropdown items
    const dedTemp = screen.getByRole('link', { name: 'Deducciones Temporales' });
    expect(dedTemp).toHaveClass('dropdown-item');
    expect(dedTemp).toHaveAttribute('href', '/temporary-deduction');

    const addTemp = screen.getByRole('link', { name: 'Adiciones Temporales' });
    expect(addTemp).toHaveClass('dropdown-item');
    expect(addTemp).toHaveAttribute('href', '/temporary-addition');

    const addPerm = screen.getByRole('link', { name: 'Adiciones Permanentes' });
    expect(addPerm).toHaveClass('dropdown-item');
    expect(addPerm).toHaveAttribute('href', '/permanent-addition');
  });

  it('renders the "Reporte" dropdown and its items', () => {
    const repToggle = screen.getByRole('button', { name: 'Reporte' });
    expect(repToggle).toBeInTheDocument();
    expect(repToggle).toHaveClass('nav-link', 'dropdown-toggle');

    const taxBook = screen.getByRole('link', {
      name: 'Libro Tributario de Activo Fijo',
    });
    expect(taxBook).toHaveClass('dropdown-item');
    expect(taxBook).toHaveAttribute('href', '/report-tax-book');

    const detail = screen.getByRole('link', {
      name: 'Detalle Depreciación Financiera y Tributaria',
    });
    expect(detail).toHaveClass('dropdown-item');
    expect(detail).toHaveAttribute('href', '/report-detail-depreciation');
  });
});

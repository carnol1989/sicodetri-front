import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from '../../src/components/Header';

describe('Header component', () => {
  it('renders a <header> landmark with role banner', () => {
    render(<Header />);
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
    expect(header.tagName).toBe('HEADER');
  });

  it('renders an <h1> with the correct text and class', () => {
    render(<Header />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass('text-center');
    expect(heading).toHaveTextContent('Aplicación Web para Conciliación Tributaria y Financiera');
  });

  it('contains the heading inside the header element', () => {
    render(<Header />);
    const header = screen.getByRole('banner');
    const heading = screen.getByRole('heading', { level: 1 });
    expect(header).toContainElement(heading);
  });
});

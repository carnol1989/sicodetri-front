// src/__tests__/components/Footer.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../../components/Footer';

describe('Footer component', () => {
  it('renders a <footer> with the correct classes', () => {
    render(<Footer />);
    // <footer> tiene por defecto el rol "contentinfo"
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveClass('footer', 'mt-auto', 'py-3', 'bg-body-tertiary');
  });

  it('renders a container <div> inside the footer', () => {
    render(<Footer />);
    const footer = screen.getByRole('contentinfo');
    // buscamos el <div class="container">
    const containerDiv = footer.querySelector('div.container');
    expect(containerDiv).toBeInTheDocument();
  });

  it('renders the credit <span> with the correct text and class', () => {
    render(<Footer />);
    const credit = screen.getByText('@EPS Grau 2024.');
    expect(credit).toBeInTheDocument();
    expect(credit).toHaveClass('text-body-secondary');
  });
});

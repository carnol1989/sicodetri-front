// src/__tests__/unit/views/Home.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '../../../views/Home';

// Mockeamos Header para aislar el test de Home
jest.mock('../../../components/Header', () => () => <div data-testid="header-component" />);

describe('Home component', () => {
  it('debe renderizar un <main> con la clase "flex-shrink-0"', () => {
    render(<Home />);
    const mainElement = screen.getByRole('main');
    expect(mainElement).toHaveClass('flex-shrink-0');
  });

  it('debe contener un <div> con la clase "container" dentro del <main>', () => {
    render(<Home />);
    const containerDiv = screen.getByRole('main').querySelector('.container');
    expect(containerDiv).toBeInTheDocument();
  });

  it('debe renderizar el componente Header (mockeado)', () => {
    render(<Home />);
    expect(screen.getByTestId('header-component')).toBeInTheDocument();
  });

  it('coincide con el snapshot', () => {
    const { asFragment } = render(<Home />);
    expect(asFragment()).toMatchSnapshot();
  });
});

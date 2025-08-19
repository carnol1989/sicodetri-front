// src/__tests__/unit/views/Home.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';

// Mockeamos Header para aislar el test de Home
jest.mock('../../../components/Header', () => () => <div data-testid="header-component" />);

// Mockeamos useAuth para controlar el idToken
jest.mock('../../../hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

import { useAuth } from '../../../hooks/useAuth';
import Home from '../../../views/Home';

// atob en entorno Node puede no existir; aseguramos polyfill
if (typeof global.atob !== 'function') {
  global.atob = (input) => Buffer.from(input, 'base64').toString('binary');
}

// Helper para crear JWT con payload dado (base64url)
function makeJwt(payloadObj) {
  const header = { alg: 'none', typ: 'JWT' };
  const toBase64Url = (obj) =>
    Buffer.from(JSON.stringify(obj))
      .toString('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

  const h = toBase64Url(header);
  const p = toBase64Url(payloadObj);
  return `${h}.${p}.sig`;
}

// Escapar texto para construir un RegExp seguro
function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Valida que exista la alerta y que contenga "Bienvenido, <username>"
function expectWelcome(username) {
  const strong = screen.getByText(username);
  const alert = strong.closest('.alert');
  expect(alert).toBeInTheDocument();
  expect(alert).toHaveTextContent(new RegExp(`Bienvenido,\\s*${escapeRegExp(username)}`, 'i'));
}

describe('Home component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza estructura base: <main> con clase y .container con Header', () => {
    useAuth.mockReturnValue({ idToken: null });

    const { container } = render(<Home />);

    const mainElement = screen.getByRole('main');
    expect(mainElement).toHaveClass('flex-shrink-0');

    const containerDiv = mainElement.querySelector('.container');
    expect(containerDiv).toBeInTheDocument();

    expect(screen.getByTestId('header-component')).toBeInTheDocument();

    // Sin usuario no debe existir la alerta
    expect(container.querySelector('.alert')).toBeNull();
  });

  it('muestra "Bienvenido, <name>" cuando el JWT contiene el claim name', () => {
    const token = makeJwt({ name: 'Ada Lovelace' });
    useAuth.mockReturnValue({ idToken: token });

    render(<Home />);
    expectWelcome('Ada Lovelace');
  });

  it('usa preferred_username cuando no hay name', () => {
    const token = makeJwt({ preferred_username: 'ada.l' });
    useAuth.mockReturnValue({ idToken: token });

    render(<Home />);
    expectWelcome('ada.l');
  });

  it('usa sub cuando no hay name ni preferred_username', () => {
    const token = makeJwt({ sub: 'user-123' });
    useAuth.mockReturnValue({ idToken: token });

    render(<Home />);
    expectWelcome('user-123');
  });

  it('no muestra bienvenida si el token es inválido (parseJwt devuelve null)', () => {
    useAuth.mockReturnValue({ idToken: 'bad.token' });

    const { container } = render(<Home />);
    // No debería renderizarse el bloque de alerta
    expect(container.querySelector('.alert')).toBeNull();
  });

  it('actualiza el nombre cuando cambia el idToken', () => {
    // Primer render: sin token → sin saludo
    useAuth.mockReturnValue({ idToken: null });
    const { rerender, container } = render(<Home />);
    expect(container.querySelector('.alert')).toBeNull();

    // Segundo render: token con name
    const token1 = makeJwt({ name: 'Grace Hopper' });
    useAuth.mockReturnValue({ idToken: token1 });
    rerender(<Home />);
    expectWelcome('Grace Hopper');

    // Tercer render: token distinto con preferred_username
    const token2 = makeJwt({ preferred_username: 'grace.h' });
    useAuth.mockReturnValue({ idToken: token2 });
    rerender(<Home />);
    expectWelcome('grace.h');
  });

  it('snapshot mínimo del árbol (sin usuario)', () => {
    useAuth.mockReturnValue({ idToken: null });
    const { asFragment } = render(<Home />);
    expect(asFragment()).toMatchSnapshot();
  });
});

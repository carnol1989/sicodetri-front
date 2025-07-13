// src/__tests__/index.test.js
/**
 * @jest-environment jsdom
 */
import React from 'react';

//
// 1) Mocks de CSS y Bootstrap (para que no fallen los imports)
//
jest.mock('../index.css', () => ({}));
jest.mock('bootstrap/dist/css/bootstrap.min.css', () => ({}));
jest.mock('bootstrap/dist/js/bootstrap.bundle.min', () => ({}));

//
// 2) Mock de App para verificar que realmente renderizamos ese componente
//
jest.mock('../App', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: () => <div data-testid="app">Mock App</div>,
  };
});

describe('index.js', () => {
  let createRootMock;
  let renderMock;

  beforeEach(() => {
    // Reseteamos la caché de módulos para recargar mocks
    jest.resetModules();

    // Preparamos un <div id="root"> en nuestro DOM de test
    document.body.innerHTML = '<div id="root"></div>';

    //
    // 3) Aquí mockeamos react-dom/client dinámicamente
    //
    jest.doMock('react-dom/client', () => {
      // Creamos los dos jest.fn() que necesitamos
      renderMock = jest.fn();
      createRootMock = jest.fn(() => ({ render: renderMock }));

      return {
        __esModule: true,
        // Esto cubre `import ReactDOM from 'react-dom/client'`
        default: { createRoot: createRootMock },
        // Y también `import { createRoot } from 'react-dom/client'`
        createRoot: createRootMock,
        // exportamos renderMock si queremos importarlo directamente
        renderMock,
      };
    });
  });

  it('debe crear el root y renderizar <App /> en él', () => {
    // 4) Requerimos index.js _después_ de haber hecho el doMock
    require('../index');

    // 5) Ahora traemos la misma instancia mockeada
    const { createRoot, renderMock: rm } = require('react-dom/client');
    const rootNode = document.getElementById('root');

    // 6) Aserciones sobre nuestros mocks
    expect(createRoot).toHaveBeenCalledWith(rootNode);
    expect(rm).toHaveBeenCalledTimes(1);

    // 7) Y comprobamos que lo que se pasó a render() sea nuestro <App />
    const renderedElement = rm.mock.calls[0][0];
    // Recuperamos el componente App que también está mockeado
    const App = require('../App').default;
    expect(renderedElement.type).toBe(App);
  });
});

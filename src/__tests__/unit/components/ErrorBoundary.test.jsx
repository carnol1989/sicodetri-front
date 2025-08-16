// src/__tests__/unit/components/ErrorBoundary.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from '../../../components/ErrorBoundary';

// Componentes de ayuda para forzar errores
const ThrowerWithMessage = () => {
  throw new Error('Boom!');
};

const ThrowerWithoutMessage = () => {
  // Lanza un objeto sin 'message' para activar "Error desconocido"
  // eslint-disable-next-line no-throw-literal
  throw { custom: true };
};

describe('ErrorBoundary', () => {
  let consoleErrorSpy;
  let locationGetterSpy;
  let reloadMock;

  beforeEach(() => {
    // Silencia ruido de errores en consola y nos permite assertar componentDidCatch
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Mock seguro de window.location via getter
    reloadMock = jest.fn();
    locationGetterSpy = jest.spyOn(window, 'location', 'get').mockReturnValue({
      ...window.location,
      reload: reloadMock,
    });
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    locationGetterSpy.mockRestore();
  });

  it('renderiza los children cuando no hay errores', () => {
    render(
      <ErrorBoundary>
        <div data-testid="ok">Contenido OK</div>
      </ErrorBoundary>,
    );

    expect(screen.getByTestId('ok')).toBeInTheDocument();
    expect(screen.queryByText('La aplicación encontró un problema')).not.toBeInTheDocument();
  });

  it('muestra fallback con mensaje de error, llama componentDidCatch y recarga al click', () => {
    render(
      <ErrorBoundary>
        <ThrowerWithMessage />
      </ErrorBoundary>,
    );

    // Fallback visible y mensaje del error
    expect(screen.getByText('La aplicación encontró un problema')).toBeInTheDocument();
    expect(screen.getByText('Boom!')).toBeInTheDocument();

    // Verificamos que componentDidCatch llamó a console.error(error, info)
    const matchingCall = consoleErrorSpy.mock.calls.find(
      (args) =>
        args.length === 2 &&
        args[0] instanceof Error &&
        args[0].message === 'Boom!' &&
        args[1] &&
        typeof args[1] === 'object' &&
        typeof args[1].componentStack === 'string',
    );
    expect(matchingCall).toBeTruthy();

    // Click en "Recargar" dispara window.location.reload()
    fireEvent.click(screen.getByRole('button', { name: 'Recargar' }));
    expect(reloadMock).toHaveBeenCalledTimes(1);
  });

  it('muestra "Error desconocido" cuando el error no tiene message', () => {
    render(
      <ErrorBoundary>
        <ThrowerWithoutMessage />
      </ErrorBoundary>,
    );

    expect(screen.getByText('La aplicación encontró un problema')).toBeInTheDocument();
    expect(screen.getByText('Error desconocido')).toBeInTheDocument();
  });
});

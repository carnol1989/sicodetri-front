// src/__tests__/unit/components/TokenBridge.test.jsx
import React from 'react';
import { render } from '@testing-library/react';

// Mock del hook de autenticación
jest.mock('../../../hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

import { useAuth } from '../../../hooks/useAuth';
import TokenBridge from '../../../components/TokenBridge';

describe('TokenBridge Test', () => {
  let setItemSpy;
  let removeItemSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    // Espiamos sessionStorage para verificar llamadas
    setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
    removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');
    sessionStorage.clear();
  });

  afterEach(() => {
    setItemSpy.mockRestore();
    removeItemSpy.mockRestore();
  });

  it('no renderiza nada (retorna null)', () => {
    useAuth.mockReturnValue({ isAuthenticated: false, token: null });

    const { container } = render(<TokenBridge />);
    expect(container.firstChild).toBeNull();
  });

  it('cuando está autenticado y hay token => guarda pkce_token en sessionStorage', () => {
    useAuth.mockReturnValue({ isAuthenticated: true, token: 'ABC123' });

    render(<TokenBridge />);

    expect(setItemSpy).toHaveBeenCalledTimes(1);
    expect(setItemSpy).toHaveBeenCalledWith('pkce_token', 'ABC123');
    expect(removeItemSpy).not.toHaveBeenCalled();
    expect(sessionStorage.getItem('pkce_token')).toBe('ABC123');
  });

  it('cuando NO está autenticado => elimina pkce_token', () => {
    // Semilla inicial (esto dispara el spy de setItem)
    sessionStorage.setItem('pkce_token', 'PREV');
    // Resetea contador del spy para no contar el semillado
    setItemSpy.mockClear();

    useAuth.mockReturnValue({ isAuthenticated: false, token: 'IGNORED' });

    render(<TokenBridge />);

    expect(removeItemSpy).toHaveBeenCalledTimes(1);
    expect(removeItemSpy).toHaveBeenCalledWith('pkce_token');
    expect(setItemSpy).not.toHaveBeenCalled();
    expect(sessionStorage.getItem('pkce_token')).toBeNull();
  });

  it('cuando está autenticado pero NO hay token => elimina pkce_token', () => {
    // Semilla inicial (esto dispara el spy de setItem)
    sessionStorage.setItem('pkce_token', 'PREV');
    // Resetea contador del spy para no contar el semillado
    setItemSpy.mockClear();

    useAuth.mockReturnValue({ isAuthenticated: true, token: null });

    render(<TokenBridge />);

    expect(removeItemSpy).toHaveBeenCalledTimes(1);
    expect(removeItemSpy).toHaveBeenCalledWith('pkce_token');
    expect(setItemSpy).not.toHaveBeenCalled();
    expect(sessionStorage.getItem('pkce_token')).toBeNull();
  });

  it('cambia de no autenticado a autenticado con token => primero elimina y luego setea', () => {
    // 1) Render inicial: no autenticado => removeItem
    useAuth.mockReturnValue({ isAuthenticated: false, token: null });
    const { rerender } = render(<TokenBridge />);
    expect(removeItemSpy).toHaveBeenCalledTimes(1);
    expect(setItemSpy).not.toHaveBeenCalled();

    // 2) Nuevo estado: autenticado con token => setItem
    removeItemSpy.mockClear();
    setItemSpy.mockClear();

    useAuth.mockReturnValue({ isAuthenticated: true, token: 'XYZ' });
    rerender(<TokenBridge />);

    expect(setItemSpy).toHaveBeenCalledTimes(1);
    expect(setItemSpy).toHaveBeenCalledWith('pkce_token', 'XYZ');
    expect(removeItemSpy).not.toHaveBeenCalled();
    expect(sessionStorage.getItem('pkce_token')).toBe('XYZ');
  });
});

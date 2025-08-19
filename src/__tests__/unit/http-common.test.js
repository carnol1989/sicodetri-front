// src/__tests__/unit/http-common.test.js
import 'regenerator-runtime/runtime';

let requestHandler;
let responseSuccessHandler;
let responseErrorHandler;

// Mock de axios para capturar los handlers de los interceptores
jest.mock('axios', () => {
  requestHandler = undefined;
  responseSuccessHandler = undefined;
  responseErrorHandler = undefined;

  const mockInstance = {
    interceptors: {
      request: {
        use: jest.fn((fn) => {
          requestHandler = fn;
        }),
      },
      response: {
        use: jest.fn((onSuccess, onError) => {
          responseSuccessHandler = onSuccess;
          responseErrorHandler = onError;
        }),
      },
    },
  };

  // Unificamos ambas referencias (default.create y named create) al MISMO mock
  const createMock = jest.fn(() => mockInstance);

  return {
    __esModule: true,
    default: { create: createMock },
    create: createMock,
  };
});

describe('http-common interceptors', () => {
  let originalLocation;
  let assignSpy;

  beforeEach(() => {
    jest.resetModules();
    process.env.REACT_APP_BASE_PATH_BACK = 'https://api.example.com';

    // mock de window.location.assign
    originalLocation = window.location;
    Object.defineProperty(window, 'location', {
      value: { assign: jest.fn() },
      writable: true,
    });
    assignSpy = window.location.assign;

    sessionStorage.clear();
  });

  afterEach(() => {
    Object.defineProperty(window, 'location', { value: originalLocation });
  });

  it('configura axios.create con baseURL, headers y withCredentials', async () => {
    const axios = require('axios');
    const { default: http } = require('../../http-common'); // registra interceptores

    expect(axios.create).toHaveBeenCalledTimes(1);
    const config = axios.create.mock.calls[0][0];
    expect(config).toMatchObject({
      baseURL: 'https://api.example.com',
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    });

    expect(http).toBeTruthy();
    expect(typeof requestHandler).toBe('function');
    expect(typeof responseSuccessHandler).toBe('function');
    expect(typeof responseErrorHandler).toBe('function');
  });

  it('request interceptor: agrega Authorization si existe pkce_token', async () => {
    require('../../http-common'); // registra interceptores
    sessionStorage.setItem('pkce_token', 'ABC123');

    const cfg = await requestHandler({ headers: {} });
    expect(cfg.headers.Authorization).toBe('Bearer ABC123');
  });

  it('request interceptor: no agrega Authorization si NO hay token', async () => {
    require('../../http-common'); // registra interceptores
    sessionStorage.removeItem('pkce_token');

    const cfg = await requestHandler({ headers: {} });
    expect(cfg.headers.Authorization).toBeUndefined();
  });

  it('response interceptor (success): deja pasar la respuesta sin tocarla', async () => {
    require('../../http-common'); // registra interceptores
    const res = { data: { ok: true }, status: 200 };
    const out = await responseSuccessHandler(res);
    expect(out).toBe(res);
  });

  it('response interceptor (401): limpia token, llama logOut y redirige a /error con "No autorizado"', async () => {
    // Carga UNA SOLA instancia del módulo y usa su setAuthContextRef
    const mod = require('../../http-common');
    const { setAuthContextRef } = mod;
    const auth = { logOut: jest.fn() };
    setAuthContextRef(auth);

    sessionStorage.setItem('pkce_token', 'TOKEN_X');

    const error = {
      response: { status: 401, data: { message: 'ignored' } },
      config: { url: '/api/secure' },
      message: 'Unauthorized',
    };

    await expect(responseErrorHandler(error)).rejects.toBe(error);

    expect(sessionStorage.getItem('pkce_token')).toBeNull();
    expect(auth.logOut).toHaveBeenCalledTimes(1);
    expect(assignSpy).toHaveBeenCalledTimes(1);

    const url = assignSpy.mock.calls[0][0];
    const usp = new URLSearchParams(url.split('?')[1]);
    expect(usp.get('status')).toBe('401');
    expect(usp.get('path')).toBe('/api/secure');
    expect(usp.get('message')).toBe('No autorizado');
  });

  it('response interceptor (403/404/500): redirige a /error con el mensaje del backend', async () => {
    require('../../http-common'); // registra interceptores

    // 403
    const err403 = {
      response: { status: 403, data: { message: 'Forbidden!' } },
      config: { url: '/api/forbidden' },
      message: 'Forbidden!',
    };
    await expect(responseErrorHandler(err403)).rejects.toBe(err403);
    expect(assignSpy).toHaveBeenCalledTimes(1);

    let url = assignSpy.mock.calls[0][0];
    let usp = new URLSearchParams(url.split('?')[1]);
    expect(usp.get('status')).toBe('403');
    expect(usp.get('path')).toBe('/api/forbidden');
    expect(usp.get('message')).toBe('Forbidden!'); // validación decodificada

    // 404
    assignSpy.mockClear();
    const err404 = {
      response: { status: 404, data: { message: 'Not Found' } },
      config: { url: '/api/missing' },
      message: 'Not Found',
    };
    await expect(responseErrorHandler(err404)).rejects.toBe(err404);
    url = assignSpy.mock.calls[0][0];
    usp = new URLSearchParams(url.split('?')[1]);
    expect(usp.get('status')).toBe('404');
    expect(usp.get('path')).toBe('/api/missing');
    expect(usp.get('message')).toBe('Not Found');

    // 500
    assignSpy.mockClear();
    const err500 = {
      response: { status: 500, data: { message: 'Boom' } },
      config: { url: '/api/error' },
      message: 'Boom',
    };
    await expect(responseErrorHandler(err500)).rejects.toBe(err500);
    url = assignSpy.mock.calls[0][0];
    usp = new URLSearchParams(url.split('?')[1]);
    expect(usp.get('status')).toBe('500');
    expect(usp.get('path')).toBe('/api/error');
    expect(usp.get('message')).toBe('Boom');
  });

  it('response interceptor (otro status): NO redirige y rechaza el error tal cual', async () => {
    require('../../http-common'); // registra interceptores

    const err418 = {
      response: { status: 418, data: { message: "I'm a teapot" } },
      config: { url: '/api/teapot' },
      message: "I'm a teapot",
    };

    await expect(responseErrorHandler(err418)).rejects.toBe(err418);
    expect(assignSpy).not.toHaveBeenCalled();
  });

  it('response interceptor (error sin response): usa error.message y NO redirige', async () => {
    require('../../http-common'); // registra interceptores

    const errNoResponse = {
      config: { url: '/api/timeout' },
      message: 'Network Error',
    };

    await expect(responseErrorHandler(errNoResponse)).rejects.toBe(errNoResponse);
    expect(assignSpy).not.toHaveBeenCalled();
  });
});

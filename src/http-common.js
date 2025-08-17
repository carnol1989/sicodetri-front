/**
 * HTTP common configuration module for API requests using Axios. <br/>
 * Provides a centralized Axios instance with interceptors for authentication
 * and error handling across the SICODETRI-FRONT application. <br/>
 * Path: src/http-common.js
 *
 * @module http-common
 * @requires axios
 *
 * <b>Component</b>: {@link http-common} <br/>
 * <b>Copyright</b>: &copy; 2024 EPS Grau. <br/>
 * <b>Company</b>: EPS Grau. <br/>
 *
 * @author EPS Grau
 * <br/>
 * <u>Service Provider</u>: Consultor TI <br/>
 * <u>Developed by</u>: <br/>
 * <ul>
 *   <li>Carlos Augusto Nole Machaca</li>
 * </ul>
 * <u>Changes</u>: <br/>
 * <ul>
 *   <li>Jun 06, 2025 (JSX) Component creation.</li>
 * </ul>
 *
 * @version 1.0
 */
import axios from 'axios';

/**
 * Reference to the authentication context.
 * Used to call logout or other authentication flows.
 * @type {?Object}
 * @private
 */
let authRef = null;

/**
 * Sets the authentication context reference.
 *
 * @function setAuthContextRef
 * @param {Object} auth - The authentication context object, expected to have at least a `logOut` method.
 * @example
 * import { setAuthContextRef } from './http-common';
 * setAuthContextRef(authContextInstance);
 */
export const setAuthContextRef = (auth) => {
  authRef = auth;
};

/**
 * Preconfigured Axios HTTP client instance. <br/>
 * - Uses the base URL from environment variable `REACT_APP_BASE_PATH_BACK`. <br/>
 * - Sends JSON content by default. <br/>
 * - Includes credentials (cookies) in requests. <br/>
 * - Attaches `Authorization` Bearer token from `sessionStorage.pkce_token` if present. <br/>
 * - Handles global error responses (401, 403, 404, 500) with redirects to `/error`. <br/>
 *
 * @constant
 * @type {AxiosInstance}
 *
 * @example
 * import http from './http-common';
 * http.get('/assets').then(res => console.log(res.data));
 */
const http = axios.create({
  baseURL: process.env.REACT_APP_BASE_PATH_BACK,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

http.interceptors.request.use((cfg) => {
  const t = sessionStorage.getItem('pkce_token');
  if (t) cfg.headers['Authorization'] = `Bearer ${t}`;
  return cfg;
});

http.interceptors.response.use(
  (res) => res,
  async (error) => {
    const status = error?.response?.status;
    const path = error?.config?.url || '';
    const msg = error?.response?.data?.message || error?.message || 'Error';

    // Para 401: limpias sesión y llevas a /error (o podrías reloguear)
    if (status === 401 && authRef?.logOut) {
      sessionStorage.removeItem('pkce_token');
      authRef.logOut();
      window.location.assign(
        `/error?status=401&path=${encodeURIComponent(path)}&message=${encodeURIComponent('No autorizado')}`,
      );
      return Promise.reject(error);
    }

    // Para 403/404/500 y otros
    if ([403, 404, 500].includes(status)) {
      window.location.assign(
        `/error?status=${status}&path=${encodeURIComponent(path)}&message=${encodeURIComponent(msg)}`,
      );
    }

    return Promise.reject(error);
  },
);

export default http;

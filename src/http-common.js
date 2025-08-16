// src/http-common.js
import axios from 'axios';

let authRef = null;
export const setAuthContextRef = (auth) => {
  authRef = auth;
};

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

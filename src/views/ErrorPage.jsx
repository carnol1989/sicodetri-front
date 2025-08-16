// src/views/ErrorPage.jsx
import React from 'react';
import { useLocation, Link } from 'react-router-dom';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function ErrorPage() {
  const q = useQuery();
  const status = q.get('status') || '500';
  const path = q.get('path') || '';
  const message = q.get('message') || 'Ha ocurrido un error inesperado.';

  return (
    <div className="container mt-5 pt-5">
      <h1 className="display-6">Ups… algo salió mal</h1>
      <p className="text-muted mb-1">
        Código de estado: <strong>{status}</strong>
      </p>
      {path && (
        <p className="text-muted">
          Ruta: <code>{path}</code>
        </p>
      )}
      <p className="mt-3">{message}</p>
      <div className="mt-4 d-flex gap-2">
        <Link to="/" className="btn btn-primary">
          Volver al inicio
        </Link>
        <button className="btn btn-outline-secondary" onClick={() => window.location.reload()}>
          Reintentar
        </button>
      </div>
    </div>
  );
}

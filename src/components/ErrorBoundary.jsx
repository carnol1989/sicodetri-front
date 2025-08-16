// src/components/ErrorBoundary.jsx

import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMsg: '' };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, errorMsg: error?.message || 'Error desconocido' };
  }
  componentDidCatch(error, info) {
    // Aquí podrías reportar a un servicio (Sentry, etc.)
    console.error(error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="container mt-5 pt-5">
          <h2>La aplicación encontró un problema</h2>
          <pre className="bg-light p-3 rounded">{this.state.errorMsg}</pre>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Recargar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

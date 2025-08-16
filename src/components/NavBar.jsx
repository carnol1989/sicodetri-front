// src/components/NavBar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const NavBar = () => {
  const { login, logout, isAuthenticated } = useAuth();

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.REACT_APP_BASE_PATH_BACK}/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
      });
    } catch (_) {
      /* ignore */
    }
    sessionStorage.removeItem('pkce_token');
    if (typeof logout === 'function') logout();
  };

  return (
    <>
      {/* Fixed navbar */}
      <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            SICODETRI
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarCollapse"
            aria-controls="navbarCollapse"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarCollapse">
            <ul className="navbar-nav me-auto mb-2 mb-md-0">
              <li className="nav-item">
                <Link className="nav-link" to="/upload">
                  Cargar Archivo
                </Link>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Generar Proyección
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li>
                    <Link className="dropdown-item" to="/temporary-deduction">
                      Deducciones Temporales
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/temporary-addition">
                      Adiciones Temporales
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/permanent-addition">
                      Adiciones Permanentes
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Reporte
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li>
                    <Link className="dropdown-item" to="/report-tax-book">
                      Libro Tributario de Activo Fijo
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/report-detail-depreciation">
                      Detalle Depreciación Financiera y Tributaria
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>

            {/* Aquí añadimos el botón de Login/Logout */}
            <div className="d-flex">
              {isAuthenticated ? (
                <button className="btn btn-outline-light" onClick={handleLogout}>
                  Logout
                </button>
              ) : (
                <button className="btn btn-outline-light" onClick={() => login && login()}>
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;

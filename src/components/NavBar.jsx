/**
 * NavBar component for SICODETRI-FRONT. <br/>
 * Provides the main navigation bar for the application, allowing access to: <br/>
 * <ul>
 *   <li>Home (brand logo redirect)</li>
 *   <li>Cargar Archivo</li>
 *   <li>Generar Proyección:
 *     <ul>
 *       <li>Deducciones Temporales</li>
 *       <li>Adiciones Temporales</li>
 *       <li>Adiciones Permanentes</li>
 *     </ul>
 *   </li>
 *   <li>Reportes:
 *     <ul>
 *       <li>Libro Tributario de Activo Fijo</li>
 *       <li>Detalle Depreciación Financiera y Tributaria</li>
 *     </ul>
 *   </li>
 * </ul>
 *
 * Includes authentication actions (Login / Logout) handled via {@link useAuth}. <br/>
 * Path: src/components/NavBar.jsx
 *
 * @module NavBar
 * @requires module: react
 * @requires module: react-router-dom
 * @requires module:../hooks/useAuth
 *
 * <b>Component</b>: {@link NavBar} <br/>
 * <b>Company</b>: EPS Grau. <br/>
 * <b>Copyright</b>: &copy; 2024 EPS Grau. <br/>
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
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * Navigation bar component. <br/>
 * Renders a fixed-top navigation bar with brand, links to features, dropdowns for
 * projections and reports, and a dynamic login/logout button based on authentication state. <br/>
 *
 * Uses Bootstrap classes for styling and responsive behavior. <br/>
 *
 * @function
 * @returns {JSX.Element} The navigation bar element.
 *
 * @example
 * import NavBar from '../components/NavBar';
 *
 * function Layout() {
 *   return (
 *     <>
 *       <NavBar />
 *       <main className="container mt-4">Contenido principal</main>
 *     </>
 *   );
 * }
 */
const NavBar = () => {
  const { login, logout, isAuthenticated } = useAuth();

  /**
   * Handles user logout by calling backend endpoint and clearing session token. <br/>
   * If `logout` from {@link useAuth} is available, it is executed afterwards.
   *
   * @async
   * @function
   * @returns {Promise.<void>} Resolves when logout process is completed.
   */
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

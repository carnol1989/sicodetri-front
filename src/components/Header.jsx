/**
 * Header component for SICODETRI-FRONT. <br/>
 * Provides the main application header, displaying the system title: <br/>
 * <i>“Aplicación Web para Conciliación Tributaria y Financiera”</i>. <br/>
 * Path: src/components/Header.jsx
 *
 * @module Header
 * @requires module: react
 *
 * <b>Component</b>: {@link Header} <br/>
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

/**
 * Header component. <br/>
 * Renders the application header with the main system title. <br/>
 *
 * This component uses Bootstrap's `text-center` class
 * to horizontally center the application title. <br/>
 *
 * @function
 * @returns {JSX.Element} The header element containing the application title.
 *
 * @example
 * import Header from '../components/Header';
 *
 * function HomePage() {
 *   return (
 *     <div>
 *       <Header />
 *       <p>Bienvenido al sistema.</p>
 *     </div>
 *   );
 * }
 */
const Header = () => {
  return (
    <header>
      <h1 className="text-center">Aplicación Web para Conciliación Tributaria y Financiera</h1>
    </header>
  );
};

export default Header;

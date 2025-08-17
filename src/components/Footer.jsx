/**
 * Footer component for SICODETRI-FRONT. <br/>
 * Provides a persistent footer displayed at the bottom of the application layout. <br/>
 * Includes company branding and copyright information. <br/>
 * Path: src/components/Footer.jsx
 *
 * @module Footer
 * @requires module: react
 *
 * <b>Component</b>: {@link Footer} <br/>
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
import React from 'react';

/**
 * Footer component. <br/>
 * Renders the application footer containing: <br/>
 * - A container with EPS Grau branding. <br/>
 * - Copyright year. <br/>
 *
 * This footer is styled using Bootstrap utility classes
 * and is placed at the bottom of the viewport (`mt-auto`). <br/>
 *
 * @function
 * @returns {JSX.Element} The footer element with company branding.
 *
 * @example
 * import Footer from '../components/Footer';
 *
 * function AppLayout() {
 *   return (
 *     <div className="d-flex flex-column min-vh-100">
 *       <main className="flex-grow-1">
 *         <AppContent />
 *       </main>
 *       <Footer />
 *     </div>
 *   );
 * }
 */
const Footer = () => {
  return (
    <footer className="footer mt-auto py-3 bg-body-tertiary">
      <div className="container">
        <span className="text-body-secondary">@EPS Grau 2024.</span>
      </div>
    </footer>
  );
};

export default Footer;

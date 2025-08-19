/**
 * Home page component for SICODETRI-FRONT. <br/>
 * Displays the application header and, if available, a personalized welcome
 * message for the authenticated user extracted from the ID token. <br/>
 * Path: src/views/Home.js
 *
 * @module Home
 * @requires module: react
 * @requires module:../components/Header
 * @requires module:../hooks/useAuth
 *
 * <b>Component</b>: {@link Home} <br/>
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
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { useAuth } from '../hooks/useAuth';

/**
 * Decodes a JWT token payload into a JSON object. <br/>
 * Handles base64url decoding and UTF-8 parsing. <br/>
 *
 * @function parseJwt
 * @param {string} token - The JWT token string.
 * @returns {?Object} The decoded payload as a JSON object, or `null` if parsing fails.
 *
 * @example
 * const payload = parseJwt(idToken);
 * console.log(payload.name);
 */
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

/**
 * Home component. <br/>
 * - Uses {@link useAuth} to retrieve the `idToken`. <br/>
 * - Decodes the JWT via {@link parseJwt} to extract the username. <br/>
 * - Renders {@link Header} and, if authenticated, displays a welcome alert with the username. <br/>
 *
 * @function Home
 * @returns {JSX.Element} Rendered home page.
 *
 * @example
 * // Route definition
 * <Route path="/home" element={<Home />} />
 */
const Home = () => {
  const { idToken } = useAuth();
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (idToken) {
      const decoded = parseJwt(idToken);
      if (decoded) {
        // Puedes ajustar aquí según el claim que tengas: sub, preferred_username, name...
        setUsername(decoded.name || decoded.preferred_username || decoded.sub || '');
      }
    }
  }, [idToken]);

  return (
    <>
      <main className="flex-shrink-0">
        <div className="container">
          <Header />
          {username && (
            <div className="alert alert-info mt-3">
              Bienvenido, <strong>{username}</strong>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default Home;

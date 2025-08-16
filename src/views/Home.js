// src/views/Home.js
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { useAuth } from '../hooks/useAuth';

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

// src/App.js
import React from 'react';
import './styles/styles.css';
import './styles/sticky-footer-navbar.css';
import { FixedAssetContext } from './context/FixedAssetContext';
import Footer from './components/Footer';
import GlobalRouter from './router/GlobalRouter';

function App() {
  const fixedAssetList = [];
  return (
    <div>
      <FixedAssetContext.Provider value={{ fixedAssetList }}>
        <GlobalRouter></GlobalRouter>
        <Footer />
      </FixedAssetContext.Provider>
    </div>
  );
}

export default App;

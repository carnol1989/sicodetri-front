// src/App.js
import React from 'react';
import './styles/styles.css';
import './styles/sticky-footer-navbar.css';
import { FixedAssetContext } from './context/FixedAssetContext';
import TokenBridge from './components/TokenBridge';
import Footer from './components/Footer';
import GlobalRouter from './router/GlobalRouter';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const fixedAssetList = [];
  return (
    <div>
      <ErrorBoundary>
        <FixedAssetContext.Provider value={{ fixedAssetList }}>
          <TokenBridge />
          <GlobalRouter></GlobalRouter>
          <Footer />
        </FixedAssetContext.Provider>
      </ErrorBoundary>
    </div>
  );
}

export default App;

# SICODETRI-FRONT V1
> Aplicación web para proceso de conciliación de la Depreciación Tributaria vs la Financiera de los Activos Fijos de la EPS GRau.

[![Propiedad Intelectual](https://img.shields.io/badge/Propiedad%20Intelectual-%C2%A9%20EPS%20Grau-red)](#)
[![React](https://img.shields.io/badge/react-18+-61dafb.svg)](#)

---
## 📦 Requisitos
- Node.js **>= ^18.3.1**
- npm **>= 8.11.0**
---
## 🚀 Inicio rápido
```bash
# 1) Instalar dependencias
npm install

# 2) Ejecutar en desarrollo
npm start        # CRA / react-scripts
# npm run dev    # Vite, si tu proyecto lo usa

# 3) Construir para producción
npm run build

# 4) Servir build local (opcional)
npx serve -s build

# 5) Pruebas (Jest + RTL)
npm test           # interactivo
```
---
## 📦 Scripts principales
> En la sección scripts del `package.json` se tienen configurado:

```json
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test:unit": "cross-env COVERAGE_DIRECTORY=coverage/unit JEST_HTML_REPORTERS_PUBLIC_PATH=coverage/unit JEST_HTML_REPORTERS_FILENAME=unit-report.html jest --config jest.config.js --coverage --testMatch \"<rootDir>/src/**/__tests__/unit/**/*.test.(js|jsx|ts|tsx)\"",
    "test:integration": "cross-env COVERAGE_DIRECTORY=coverage/integration JEST_HTML_REPORTERS_PUBLIC_PATH=coverage/integration JEST_HTML_REPORTERS_FILENAME=integration-report.html jest --config jest.config.js --coverage --testMatch \"<rootDir>/src/**/__tests__/integration/**/*.integration.test.(js|jsx|ts|tsx)\"",
    "test:all": "npm run test:unit && npm run test:integration",
    "test": "react-scripts test",
    "test:coverage": "react-scripts test --coverage --watchAll=false",
    "test:watch": "react-scripts test --watchAll",
    "test:ci": "CI=true react-scripts test --coverage",
    "test:integration:coverage": "react-scripts test --testPathPattern=integration --coverage --watchAll=false",
    "doc:fix": "node scripts/fix-jsdoc.js",
    "doc:gen": "jsdoc -c jsdoc.json",
    "doc": "npm-run-all doc:gen",
    "doc:smoke": "node scripts/jsdoc-smoke.js",
    "eject": "react-scripts eject",
    "format": "prettier --write 'src/**/*.{js,jsx,ts,tsx,json,css,md}'",
    "lint": "eslint \"src/**/*.{js,jsx,ts,tsx}\"",
    "lint:fix": "eslint \"src/**/*.{js,jsx,ts,tsx}\" --fix"
  }
```
---
## 🗂️ Estructura de Carpetas
```bash
sicodetri-front/
├── README.md
├── babel.config.js
├── jest.config.js
├── jsconfig.json
├── jsdoc-smoke-test.js
├── jsdoc.json
├── package-lock.json
├── package.json
├── public/
│   ├── favicon.ico
│   ├── index.html
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   └── robots.txt
├── scripts/
│   ├── fix-jsdoc-imports.js
│   ├── fix-jsdoc.js
│   └── jsdoc-smoke.js
├── src/
│   ├── App.css
│   ├── App.js
│   ├── __tests__/
│   │   ├── integration/
│   │   │   ├── FileUpload.integration.test.jsx
│   │   │   ├── PermanentAdditions.integration.test.jsx
│   │   │   ├── ReportDetailDepreciation.integration.test.jsx
│   │   │   ├── ReportTaxBook.integration.test.jsx
│   │   │   ├── TemporaryAdditions.integration.test.jsx
│   │   │   ├── TemporaryDeductions.integration.test.jsx
│   │   │   └── data/
│   │   │       └── assets.xlsx
│   │   └── unit/
│   │       ├── App.test.js
│   │       ├── __snapshots__
│   │       │   └── App.test.js.snap
│   │       ├── components/
│   │       │   ├── CustomDatePicker.test.jsx
│   │       │   ├── ErrorBoundary.test.jsx
│   │       │   ├── Footer.test.jsx
│   │       │   ├── Header.test.jsx
│   │       │   ├── NavBar.test.jsx
│   │       │   ├── PrivateRoute.jsx
│   │       │   ├── ProjectionGenerator.test.jsx
│   │       │   ├── ReportTemplate.test.jsx
│   │       │   └── TokenBridge.test.jsx
│   │       ├── hooks/
│   │       │   ├── useAuth.test.js
│   │       │   └── useReport.test.js
│   │       ├── http-common.test.js
│   │       ├── index.test.js
│   │       ├── reportWebVitals.test.js
│   │       ├── router/
│   │       │   └── GlobalRouter.test.jsx
│   │       ├── services/
│   │       │   └── FinancialFixedAssetService.test.js
│   │       └── views/
│   │           ├── CallbackPage.test.jsx
│   │           ├── ErrorPage.test.jsx
│   │           ├── FileUpload.test.js
│   │           ├── Home.test.js
│   │           ├── PermanentAdditions.test.jsx
│   │           ├── ReportDetailDepreciation.test.jsx
│   │           ├── ReportTaxBook.test.jsx
│   │           ├── TemporaryAdditions.test.jsx
│   │           ├── TemporaryDeductions.test.jsx
│   │           └── __snapshots__/
│   │               ├── Home.test.js.snap
│   │               ├── PermanentAdditions.test.jsx.snap
│   │               ├── ReportTaxBook.test.jsx.snap
│   │               ├── TemporaryAdditions.test.jsx.snap
│   │               └── TemporaryDeductions.test.jsx.snap
│   ├── components/
│   │   ├── CustomDatePicker.js
│   │   ├── ErrorBoundary.jsx
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   ├── NavBar.jsx
│   │   ├── PrivateRoute.jsx
│   │   ├── ProjectionGenerator.jsx
│   │   ├── ReportTemplate.jsx
│   │   └── TokenBridge.jsx
│   ├── context/
│   │   └── FixedAssetContext.js
│   ├── hooks/
│   │   ├── useAuth.js
│   │   └── useReport.js
│   ├── http-common.js
│   ├── index.css
│   ├── index.js
│   ├── logo.svg
│   ├── reportWebVitals.js
│   ├── router/
│   │   └── GlobalRouter.js
│   ├── services/
│   │   └── FinancialFixedAssetService.js
│   ├── setupTests.js
│   ├── styles/
│   │   ├── sticky-footer-navbar.css
│   │   └── styles.css
│   ├── types/
│   │   └── jsdoc-globals.js
│   └── views/
│       ├── CallbackPage.jsx
│       ├── ErrorPage.jsx
│       ├── FileUpload.js
│       ├── Home.js
│       ├── PermanentAdditions.jsx
│       ├── ReportDetailDepreciation.jsx
│       ├── ReportTaxBook.jsx
│       ├── TemporaryAdditions.jsx
│       └── TemporaryDeductions.jsx
└── webpack.config.js
```
---
## 🔐 Variables de entorno
Configuración del archivo `.env`:
```
# Puerto en el que corre tu React (CRA por defecto usa 3000)
REACT_APP_PORT=3000

# URL base de tu BFF / Backend
REACT_APP_BASE_PATH_BACK=http://localhost:8082

# Endpoint en tu BFF para Token
REACT_APP_OAUTH_CLIENT_ID=sicodetriapp
REACT_APP_OAUTH_AUTH_URL=${REACT_APP_BASE_PATH_BACK}/oauth2/authorize
REACT_APP_OAUTH_TOKEN_PATH=/auth/token
REACT_APP_OAUTH_REDIRECT_URI=http://localhost:3000/callback
REACT_APP_OAUTH_SCOPES=openid roles

# Ruta de tu API de activos fijos (Resource Server)
REACT_APP_URL_API_FINANCIAL_FIXED_ASSETS=/api/v1/financial-fixed-assets
```
---
## 📜 Aviso Legal
Este proyecto es propiedad intelectual de &reg;EPS Grau.  
El uso, distribución o reproducción sin autorización está estrictamente prohibido.
---
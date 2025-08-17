/**
 * Fixed Asset context for SICODETRI-FRONT. <br/>
 * Provides a React Context to share fixed asset data across the component tree. <br/>
 * Used primarily to manage and distribute state related to financial fixed assets
 * (e.g., loaded from Excel uploads or backend services). <br/>
 * Path: src/context/FixedAssetContext.js
 *
 * <b>Context</b>: {@link FixedAssetContext} <br/>
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
 *   <li>Jun 06, 2025 (JS) Context creation.</li>
 * </ul>
 *
 * @version 1.0
 *
 * @module FixedAssetContext
 * @requires module: react
 */
import React from 'react';

/**
 * React Context for financial fixed assets. <br/>
 * - Default value is `undefined`.
 * - Typically provided at root level by wrapping the application with:
 *   ```jsx
 *   <FixedAssetContext.Provider value={{ fixedAssetList }}>
 *     <App />
 *   </FixedAssetContext.Provider>
 *   ```
 *
 * @constant
 * @type {React.Context<any>}
 *
 * @example
 * import { FixedAssetContext } from '../context/FixedAssetContext';
 *
 * function SomeComponent() {
 *   const { fixedAssetList } = React.useContext(FixedAssetContext);
 *   return <div>Total activos: {fixedAssetList.length}</div>;
 * }
 */
export const FixedAssetContext = React.createContext();

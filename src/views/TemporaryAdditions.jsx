/**
 * Temporary additions page for SICODETRI-FRONT. <br/>
 * Wraps the {@link ProjectionGenerator} component to generate temporary additions
 * for financial fixed assets using the backend service. <br/>
 * Path: src/views/TemporaryAdditions.jsx
 *
 * @module TemporaryAdditions
 * @requires module: react
 * @requires module:../components/ProjectionGenerator
 * @requires module:../services/FinancialFixedAssetService
 *
 * <b>Component</b>: {@link TemporaryAdditions} <br/>
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
import ProjectionGenerator from '../components/ProjectionGenerator';
import FinancialFixedAssetService from '../services/FinancialFixedAssetService';

/**
 * TemporaryAdditions component. <br/>
 * - Renders {@link ProjectionGenerator} with a fixed title and parameters. <br/>
 * - Uses {@link FinancialFixedAssetService.generateTemporaryAdditionsService} as the service function. <br/>
 * - Passes parameter `"ALL"` to backend service for projection generation. <br/>
 *
 * @function TemporaryAdditions
 * @returns {JSX.Element} Rendered projection generator for temporary additions.
 *
 * @example
 * // Route definition
 * <Route path="/temporary-additions" element={<TemporaryAdditions />} />
 */
const TemporaryAdditions = () => (
  <ProjectionGenerator
    title="Generación de Adiciones Temporales"
    serviceFn={FinancialFixedAssetService.generateTemporaryAdditionsService}
    param="ALL"
  />
);

export default TemporaryAdditions;

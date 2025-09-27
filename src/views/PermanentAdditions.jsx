/**
 * Permanent additions page for SICODETRI-FRONT. <br/>
 * Wraps the {@link ProjectionGenerator} component to generate permanent additions
 * for financial fixed assets using the backend service. <br/>
 * Path: src/views/PermanentAdditions.jsx
 *
 * @module PermanentAdditions
 * @requires module: react
 * @requires module:../components/ProjectionGenerator
 * @requires module:../services/FinancialFixedAssetService
 *
 * <b>Component</b>: {@link PermanentAdditions} <br/>
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
 * PermanentAdditions component. <br/>
 * - Renders {@link ProjectionGenerator} with a fixed title and parameters. <br/>
 * - Uses {@link FinancialFixedAssetService.generatePermanentAdditionsService} as the service function. <br/>
 * - Passes parameter `"332"` to backend service for projection generation. <br/>
 *
 * @function PermanentAdditions
 * @returns {JSX.Element} Rendered projection generator for permanent additions.
 *
 * @example
 * // Route definition
 * <Route path="/permanent-additions" element={<PermanentAdditions />} />
 */
const PermanentAdditions = () => (
  <ProjectionGenerator
    title="Generación de Adiciones Permanentes"
    serviceFn={FinancialFixedAssetService.generatePermanentAdditionsService}
    param="1000"
  />
);

export default PermanentAdditions;

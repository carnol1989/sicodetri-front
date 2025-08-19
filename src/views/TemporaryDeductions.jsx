/**
 * Temporary deductions page for SICODETRI-FRONT. <br/>
 * Wraps the {@link ProjectionGenerator} component to generate temporary deductions
 * for financial fixed assets using the backend service. <br/>
 * Path: src/views/TemporaryDeductions.jsx
 *
 * @module TemporaryDeductions
 * @requires module: react
 * @requires module:../components/ProjectionGenerator
 * @requires module:../services/FinancialFixedAssetService
 *
 * <b>Component</b>: {@link TemporaryDeductions} <br/>
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
 * TemporaryDeductions component. <br/>
 * - Renders {@link ProjectionGenerator} with a fixed title and parameters. <br/>
 * - Uses {@link FinancialFixedAssetService.generateTemporaryDeductionsService} as the service function. <br/>
 * - Passes parameter `"332"` to backend service for projection generation. <br/>
 *
 * @function TemporaryDeductions
 * @returns {JSX.Element} Rendered projection generator for temporary deductions.
 *
 * @example
 * // Route definition
 * <Route path="/temporary-deductions" element={<TemporaryDeductions />} />
 */
const TemporaryDeductions = () => (
  <ProjectionGenerator
    title="Generación de Deducciones Temporales"
    serviceFn={FinancialFixedAssetService.generateTemporaryDeductionsService}
    param="332"
  />
);

export default TemporaryDeductions;

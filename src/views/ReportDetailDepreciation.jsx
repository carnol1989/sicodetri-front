/**
 * Report detail depreciation page for SICODETRI-FRONT. <br/>
 * Wraps the {@link ReportTemplate} component to generate and display
 * the detailed report of financial and tax depreciation. <br/>
 * Path: src/views/ReportDetailDepreciation.jsx
 *
 * @module ReportDetailDepreciation
 * @requires module: react
 * @requires module:../components/ReportTemplate
 *
 * <b>Component</b>: {@link ReportDetailDepreciation} <br/>
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
import ReportTemplate from '../components/ReportTemplate';

/**
 * ReportDetailDepreciation component. <br/>
 * - Renders {@link ReportTemplate} with predefined props for the detail report. <br/>
 * - `title`: "Reporte: Detalle de Depreciación Financiera y Tributaria". <br/>
 * - `option`: "2" (used internally to fetch the corresponding report). <br/>
 * - `withYear`: `false`, disables year filtering. <br/>
 *
 * @function ReportDetailDepreciation
 * @returns {JSX.Element} Rendered report template for financial and tax depreciation details.
 *
 * @example
 * // Route definition
 * <Route path="/report-detail-depreciation" element={<ReportDetailDepreciation />} />
 */
export default function ReportDetailDepreciation() {
  return (
    <ReportTemplate
      title="Reporte: Detalle de Depreciación Financiera y Tributaria"
      option="2"
      withYear={false}
    />
  );
}

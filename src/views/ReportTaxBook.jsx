/**
 * Report tax book page for SICODETRI-FRONT. <br/>
 * Wraps the {@link ReportTemplate} component to generate and display
 * the tax book report of financial fixed assets. <br/>
 * Path: src/views/ReportTaxBook.jsx
 *
 * <b>Component</b>: {@link ReportTaxBook} <br/>
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
 *
 * @module ReportTaxBook
 * @requires module:react
 * @requires module:../components/ReportTemplate
 */
import React from 'react';
import ReportTemplate from '../components/ReportTemplate';

/**
 * ReportTaxBook component. <br/>
 * - Renders {@link ReportTemplate} with predefined props for the tax book report. <br/>
 * - `title`: "Reporte: Libro Tributario de Activo Fijos". <br/>
 * - `option`: "1" (used internally to fetch the corresponding report). <br/>
 * - `withYear`: `true`, enables year filtering. <br/>
 *
 * @function ReportTaxBook
 * @returns {JSX.Element} Rendered report template for the tax book of fixed assets.
 *
 * @example
 * // Route definition
 * <Route path="/report-tax-book" element={<ReportTaxBook />} />
 */
export default function ReportTaxBook() {
  return (
    <ReportTemplate title="Reporte: Libro Tributario de Activo Fijos" option="1" withYear={true} />
  );
}

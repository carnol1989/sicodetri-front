/**
 * Custom hook for generating financial fixed asset reports in SICODETRI-FRONT. <br/>
 * Manages form state, validation, progress tracking, and delegates report
 * generation to {@link FinancialFixedAssetService.generateReportsService}. <br/>
 * Path: src/hooks/useReport.js
 *
 * @module useReport
 * @requires module: react
 * @requires module: date-fns
 * @requires module:../services/FinancialFixedAssetService
 *
 * <b>Hook</b>: {@link useReport} <br/>
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
 *   <li>Jun 06, 2025 (JS) Hook creation.</li>
 * </ul>
 *
 * @version 1.0
 */
import { useState } from 'react';
import { format } from 'date-fns';
import FinancialFixedAssetService from '../services/FinancialFixedAssetService';

/**
 * State and actions returned by {@link useReport}.
 *
 * @typedef {Object} UseReportState
 * @property {number} progress - Download progress percentage (0–100).
 * @property {?Date} year - Selected year (nullable if `withYear` is true).
 * @property {function(Date):void} setYear - Setter for `year`.
 * @property {string} mainCode - Fixed asset main code filter.
 * @property {function(string):void} setMainCode - Setter for `mainCode`.
 * @property {string} accountingAccount - Accounting account filter.
 * @property {function(string):void} setAccountingAccount - Setter for `accountingAccount`.
 * @property {?Date} startAcq - Start acquisition date.
 * @property {function(Date):void} setStartAcq - Setter for `startAcq`.
 * @property {?Date} endAcq - End acquisition date.
 * @property {function(Date):void} setEndAcq - Setter for `endAcq`.
 * @property {?Date} startUse - Start use date.
 * @property {function(Date):void} setStartUse - Setter for `startUse`.
 * @property {?Date} endUse - End use date.
 * @property {function(Date):void} setEndUse - Setter for `endUse`.
 * @property {boolean} disabled - Whether the "Generate Report" button should be disabled.
 * @property {function():Promise.<void>} generate - Triggers report generation and handles progress.
 */

/**
 * React hook to manage report generation state and actions. <br/>
 * - Tracks filters: year, codes, accounts, acquisition/use dates. <br/>
 * - Validates required fields before enabling report generation. <br/>
 * - Delegates report download to {@link FinancialFixedAssetService.generateReportsService}. <br/>
 *
 * @function useReport
 * @param {string} option - Report option (e.g., `"1"` for Tax Book, `"2"` for Depreciation Detail).
 * @param {boolean} withYear - Whether the report requires year selection.
 * @returns {UseReportState} Report state, setters, validation flag, and `generate` action.
 *
 * @example
 * import useReport from '../hooks/useReport';
 *
 * function ReportTaxBook() {
 *   const {
 *     year, setYear,
 *     mainCode, setMainCode,
 *     disabled,
 *     generate,
 *     progress
 *   } = useReport("1", true);
 *
 *   return (
 *     <div>
 *       <input
 *         type="text"
 *         value={mainCode}
 *         onChange={(e) => setMainCode(e.target.value)}
 *       />
 *       <button disabled={disabled} onClick={generate}>
 *         Generar Reporte
 *       </button>
 *       {progress > 0 && <p>Progreso: {progress}%</p>}
 *     </div>
 *   );
 * }
 */
export default function useReport(option, withYear) {
  const [progress, setProgress] = useState(0);
  // Sólo presetear un Date para los reportes que NO piden selector de año
  const [year, setYear] = useState(withYear ? null : new Date('1900'));
  const [mainCode, setMainCode] = useState('');
  const [accountingAccount, setAccountingAccount] = useState('');
  const [startAcq, setStartAcq] = useState(null);
  const [endAcq, setEndAcq] = useState(null);
  const [startUse, setStartUse] = useState(null);
  const [endUse, setEndUse] = useState(null);

  // Deshabilita botón hasta que estén todos los campos obligatorios
  const disabled = withYear
    ? !(year && startAcq && endAcq && startUse && endUse)
    : !(startAcq && endAcq && startUse && endUse);

  const generate = async () => {
    setProgress(0);

    // FORMATEO AQUI, con guardas para evitar `null`
    const yearFormat = withYear
      ? format(year, 'yyyy') // aquí year ya NO es null porque el botón sólo activa cuando year !== null
      : format(year, 'yyyy'); // año `"1900"` por defecto
    const startAcqFmt = format(startAcq, 'yyyy-MM-dd');
    const endAcqFmt = format(endAcq, 'yyyy-MM-dd');
    const startUseFmt = format(startUse, 'yyyy-MM-dd');
    const endUseFmt = format(endUse, 'yyyy-MM-dd');

    await FinancialFixedAssetService.generateReportsService(
      option,
      yearFormat,
      mainCode,
      accountingAccount,
      startAcqFmt,
      endAcqFmt,
      startUseFmt,
      endUseFmt,
      (evt) => {
        if (evt.lengthComputable) {
          setProgress(Math.round((evt.loaded * 100) / evt.total));
        }
      },
    );
  };

  return {
    progress,
    year,
    setYear,
    mainCode,
    setMainCode,
    accountingAccount,
    setAccountingAccount,
    startAcq,
    setStartAcq,
    endAcq,
    setEndAcq,
    startUse,
    setStartUse,
    endUse,
    setEndUse,
    disabled,
    generate,
  };
}

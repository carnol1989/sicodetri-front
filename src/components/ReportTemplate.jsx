/**
 * ReportTemplate component for SICODETRI-FRONT. <br/>
 * Provides a reusable template for generating and exporting financial/tax reports
 * with filtering options. <br/>
 *
 * Behavior: <br/>
 * <ul>
 *   <li>Displays a form with labeled fields for asset codes, accounting accounts, and date ranges.</li>
 *   <li>Optionally includes a year selector if {@link withYear} is enabled.</li>
 *   <li>Uses {@link useReport} hook to handle state, progress, and backend integration.</li>
 *   <li>Shows a progress bar while generating reports.</li>
 *   <li>Includes an export button that triggers the backend service to download the report.</li>
 * </ul>
 * Path: src/components/ReportTemplate.jsx
 *
 * @module ReportTemplate
 * @requires module: react
 * @requires module: prop-types
 * @requires module:./CustomDatePicker
 * @requires module:../hooks/useReport
 *
 * <b>Component</b>: {@link ReportTemplate} <br/>
 * <b>Company</b>: EPS Grau <br/>
 * <b>Copyright</b>: &copy; 2024 EPS Grau. <br/>
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
import PropTypes from 'prop-types';
import CustomDatePicker from './CustomDatePicker';
import useReport from '../hooks/useReport';

/**
 * LabeledField component. <br/>
 * Internal helper for rendering a form field with an associated label. <br/>
 *
 * @function
 * @param {Object} props - Props del componente.
 * @param {string} props.label - Texto de la etiqueta.
 * @param {string} [props.htmlFor] - Atributo htmlFor del label (opcional).
 * @param {React.ReactNode} props.children - Elemento(s) de entrada asociados a la etiqueta.
 * @returns {JSX.Element} Componente renderizado con label y contenido.
 */
const LabeledField = ({ label, children, htmlFor }) => (
  <div className="row mb-3">
    <div className="col-md-4 text-end">
      <label htmlFor={htmlFor} className="form-label">
        {label}
      </label>
    </div>
    <div className="col-md-8">{children}</div>
  </div>
);
LabeledField.propTypes = {
  label: PropTypes.string.isRequired,
  htmlFor: PropTypes.string,
  children: PropTypes.node.isRequired,
};

/**
 * Main ReportTemplate component. <br/>
 * Handles rendering of report filter inputs and report generation/export actions. <br/>
 *
 * @function
 * @param {Object} props - Props del componente.
 * @param {string} props.title - Título del reporte a mostrar en el encabezado.
 * @param {string} props.option - Opción de reporte enviada al backend.
 * @param {boolean} [props.withYear=false] - Indica si se debe habilitar el selector de año.
 * @returns {JSX.Element} Componente renderizado de plantilla de reporte.
 *
 * @example
 * import ReportTemplate from '../components/ReportTemplate';
 *
 * <ReportTemplate
 *   title="Reporte: Libro Tributario de Activo Fijos"
 *   option="1"
 *   withYear={true}
 * />
 */
export default function ReportTemplate({ title, option, withYear = false }) {
  const {
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
  } = useReport(option, withYear);

  return (
    <main className="flex-shrink-0">
      <div className="container">
        <div className="row mb-3">
          <h3>{title}</h3>
        </div>

        {withYear && (
          <LabeledField label="Seleccione el periodo:">
            <CustomDatePicker selected={year} onChange={setYear} dateFormat="yyyy" />
          </LabeledField>
        )}

        <LabeledField label="Código Activo Fijo Principal:" htmlFor="mainCode">
          <input
            id="mainCode"
            type="text"
            className="form-control-sm"
            value={mainCode}
            onChange={(e) => setMainCode(e.target.value)}
          />
        </LabeledField>

        <LabeledField label="Cuenta Contable del Activo Fijo:" htmlFor="accountingAccount">
          <input
            id="accountingAccount"
            type="text"
            className="form-control-sm"
            value={accountingAccount}
            onChange={(e) => setAccountingAccount(e.target.value)}
          />
        </LabeledField>

        <LabeledField label="Fecha de Inicio de Adquisición:">
          <CustomDatePicker selected={startAcq} onChange={setStartAcq} dateFormat="yyyy-MM-dd" />
        </LabeledField>

        <LabeledField label="Fecha de Fin de Adquisición:">
          <CustomDatePicker selected={endAcq} onChange={setEndAcq} dateFormat="yyyy-MM-dd" />
        </LabeledField>

        <LabeledField label="Fecha de Inicio de Uso:">
          <CustomDatePicker selected={startUse} onChange={setStartUse} dateFormat="yyyy-MM-dd" />
        </LabeledField>

        <LabeledField label="Fecha de Fin de Uso:">
          <CustomDatePicker selected={endUse} onChange={setEndUse} dateFormat="yyyy-MM-dd" />
        </LabeledField>

        <div className="row mb-3">
          <div className="progress">
            <div
              className="progress-bar progress-bar-info progress-bar-striped"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              style={{ width: `${progress}%` }}
            >
              {progress}%
            </div>
          </div>
        </div>

        <div className="row mb-3">
          <div className="d-flex gap-2">
            <button className="btn btn-primary" disabled={disabled} onClick={generate}>
              Exportar
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

ReportTemplate.propTypes = {
  title: PropTypes.string.isRequired,
  option: PropTypes.string.isRequired,
  withYear: PropTypes.bool,
};

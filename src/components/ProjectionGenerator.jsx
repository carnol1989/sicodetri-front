/**
 * ProjectionGenerator component for SICODETRI-FRONT. <br/>
 * Provides a standardized UI to generate financial or tax projections
 * by selecting a period and invoking a backend service. <br/>
 *
 * Behavior: <br/>
 * <ul>
 *   <li>Allows the user to select a period via {@link CustomDatePicker}.</li>
 *   <li>Triggers the provided service function to generate projections with progress feedback.</li>
 *   <li>Displays success or error alerts depending on backend response.</li>
 *   <li>Shows a progress bar during the generation process.</li>
 * </ul>
 * Path: src/components/ProjectionGenerator.jsx
 *
 * @module ProjectionGenerator
 * @requires module: react
 * @requires module: prop-types
 * @requires module:./CustomDatePicker
 * @requires module: react-datepicker/dist/react-datepicker.css
 *
 * <b>Component</b>: {@link ProjectionGenerator} <br/>
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
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CustomDatePicker from './CustomDatePicker';
import 'react-datepicker/dist/react-datepicker.css';

/**
 * Renders a generic projection generator form. <br/>
 * Integrates a date picker, progress bar, and success/error feedback. <br/>
 *
 * @function
 * @param {Object} props - Component props.
 * @param {string} props.title - The title of the projection generator (e.g. "Generación de Adiciones Temporales").
 * @param {Function} props.serviceFn - Backend service function that generates the projection. Must return a Promise.
 * @param {string} props.param - Parameter to be passed to the service function (e.g. asset code or "ALL").
 * @returns {JSX.Element} The rendered projection generator component.
 *
 * @example
 * import ProjectionGenerator from '../components/ProjectionGenerator';
 * import FinancialFixedAssetService from '../services/FinancialFixedAssetService';
 *
 * <ProjectionGenerator
 *   title="Generación de Deducciones Temporales"
 *   serviceFn={FinancialFixedAssetService.generateTemporaryDeductionsService}
 *   param="332"
 * />
 */
const ProjectionGenerator = ({ title, serviceFn, param }) => {
  const [progress, setProgress] = useState(0);
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [period, setPeriod] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  const generate = () => {
    setProgress(0);
    setShowAlert(true);

    if (!period) {
      setCode('');
      setMessage('Por favor seleccione un periodo.');
      return;
    }

    const periodFormatted = period.toISOString().split('T')[0];

    serviceFn(periodFormatted, param, () => {})
      .then((response) => {
        setCode(response.data.code);
        setMessage(response.data.message);
        setProgress(100);
      })
      .catch(() => {
        setCode('');
        setProgress(0);
        setMessage('No se pudo generar la proyección.');
      });
  };

  const alertClass = code === '00' ? 'alert alert-success' : 'alert alert-danger';

  return (
    <main className="flex-shrink-0">
      <div className="container">
        <div className="row mb-3">
          <h3>{title}</h3>
        </div>
        <div className="row mb-3">
          <div className="d-flex align-items-center gap-2">
            <label className="form-label mb-0">Seleccione el periodo:</label>
            <CustomDatePicker selected={period} onChange={setPeriod} />
          </div>
        </div>

        {showAlert && (
          <div className="row mb-3">
            <div className="progress w-100">
              <div
                className="progress-bar progress-bar-info progress-bar-striped"
                role="progressbar"
                style={{ width: `${progress}%` }}
                aria-valuenow={progress}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {progress}%
              </div>
            </div>
          </div>
        )}

        <div className="row mb-3">
          <button className={`btn btn-primary ${!period ? 'disabled' : ''}`} onClick={generate}>
            Generar Proyección
          </button>
        </div>

        {showAlert && (
          <div className="row mb-3">
            <div className={alertClass} role="alert">
              {message}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

ProjectionGenerator.propTypes = {
  title: PropTypes.string.isRequired,
  serviceFn: PropTypes.func.isRequired,
  param: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default ProjectionGenerator;

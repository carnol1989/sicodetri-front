/**
 * File upload page for SICODETRI-FRONT. <br/>
 * Allows users to upload Excel files of financial fixed assets, select a period,
 * and persist the data into the backend system. Displays progress, validation alerts,
 * and success/error messages. <br/>
 * Path: src/views/FileUpload.js
 *
 * @module FileUpload
 * @requires module: react
 * @requires module:../services/FinancialFixedAssetService
 * @requires module:../components/CustomDatePicker
 * @requires module: react-datepicker/dist/react-datepicker.css
 *
 * <b>Component</b>: {@link FileUpload} <br/>
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
import React, { useState } from 'react';
import FinancialFixedAssetService from '../services/FinancialFixedAssetService';
import CustomDatePicker from '../components/CustomDatePicker';
import 'react-datepicker/dist/react-datepicker.css';

/**
 * FileUpload component. <br/>
 * Main responsibilities: <br/>
 * - Select a period using {@link CustomDatePicker}. <br/>
 * - Upload Excel files to backend via {@link FinancialFixedAssetService.uploadService}. <br/>
 * - Save data after validation via {@link FinancialFixedAssetService.saveService}. <br/>
 * - Show upload progress and validation/error messages to the user. <br/>
 *
 * @function FileUpload
 * @returns {JSX.Element} Rendered component with file input, progress bar, and action buttons.
 *
 * @example
 * // Route definition
 * <Route path="/upload" element={<FileUpload />} />
 */
const FileUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState(undefined);
  const [currentFile, setCurrentFile] = useState(undefined);
  const [progress, setProgress] = useState(0);
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [period, setPeriod] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [activeSave, setActiveSave] = useState(true);

  /**
   * Handles file selection from the file input.
   * @function selectFile
   * @param {React.ChangeEvent<HTMLInputElement>} event - Change event from file input.
   */
  const selectFile = (event) => {
    setSelectedFiles(event.target.files);
  };

  /**
   * Uploads the selected Excel file to the backend service. <br/>
   * - Validates that a period has been selected. <br/>
   * - Updates progress and feedback messages. <br/>
   * - Handles both success and error responses. <br/>
   *
   * @function uploadFile
   */
  const uploadFile = () => {
    let currentFile = selectedFiles[0];

    setProgress(0);
    setCurrentFile(currentFile);

    if (!period) {
      setCode('');
      setMessage('Por favor seleccione un periodo.');
      setShowAlert(true);
      return;
    }

    const periodFormatted = period.toISOString().split('T')[0]; // YYYY-MM-DD

    FinancialFixedAssetService.uploadService(currentFile, periodFormatted, (event) => {
      setProgress(Math.round((100 * event.loaded) / event.total));
    })
      .then((response) => {
        setCode(response.data.code);
        setMessage(response.data.message);
        setActiveSave(false);
      })
      .catch(() => {
        setCode('');
        setProgress(0);
        setMessage('No se pudo subir el archivo.');
        setCurrentFile(undefined);
        setSelectedFiles(undefined);
        setActiveSave(true);
      });

    setShowAlert(true);
  };

  /**
   * Saves the uploaded data for the selected period. <br/>
   * - Validates that a period has been selected. <br/>
   * - Sends request to backend via {@link FinancialFixedAssetService.saveService}. <br/>
   * - Updates progress and feedback messages. <br/>
   *
   * @function saveDataFile
   */
  const saveDataFile = () => {
    setProgress(0);

    if (!period) {
      setCode('');
      setMessage('Por favor seleccione un periodo.');
      setShowAlert(true);
      return;
    }

    const periodFormatted = period.toISOString().split('T')[0]; // YYYY-MM-DD

    FinancialFixedAssetService.saveService(periodFormatted, (event) => {
      setProgress(Math.round((100 * event.loaded) / event.total));
    })
      .then((response) => {
        setCode(response.data.code);
        setMessage(response.data.message);
      })
      .catch(() => {
        setCode('');
        setProgress(0);
        setMessage('No se pudo guardar la información.');
        setCurrentFile(undefined);
        setSelectedFiles(undefined);
      });

    setShowAlert(true);
  };

  const alertClass = code === '00' ? 'alert alert-success' : 'alert alert-danger';

  return (
    <main className="flex-shrink-0">
      <div className="container">
        <div className="row mb-3">
          <h3>Cargar Excel de Activo Fijos</h3>
        </div>
        <div className="row">
          <div className="d-flex gap-2">
            <label className="form-label">Seleccione el periodo:</label>
            <CustomDatePicker
              selected={period}
              onChange={(date) => setPeriod(date)}
              dateFormat="yyyy-MM"
            />
          </div>
        </div>

        <div className="row">
          <div className="col">
            <label htmlFor="formFile" className="form-label">
              Subir Archivo
            </label>
            <input id="formFile" className="form-control" type="file" onChange={selectFile} />
          </div>
        </div>

        <div className="row mb-3">
          {currentFile && (
            <div className="progress">
              <div
                className="progress-bar progress-bar-info progress-bar-striped"
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin="0"
                aria-valuemax="100"
                style={{ width: progress + '%' }}
              >
                {progress}%
              </div>
            </div>
          )}
        </div>

        <div className="row mb-3">
          <div className="d-flex gap-2">
            <button className="btn btn-primary" disabled={!selectedFiles} onClick={uploadFile}>
              Subir Archivo
            </button>
            <button
              className="btn btn-primary"
              disabled={!selectedFiles || (period && activeSave)}
              onClick={saveDataFile}
            >
              Guardar Información
            </button>
          </div>
        </div>

        <div className="row mb-3">
          {showAlert && (
            <div className={alertClass} role="alert">
              {message}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default FileUpload;

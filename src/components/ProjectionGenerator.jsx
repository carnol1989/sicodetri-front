import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CustomDatePicker from './CustomDatePicker';
import 'react-datepicker/dist/react-datepicker.css';

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

        serviceFn(periodFormatted, param, (event) => {
            if (event.lengthComputable) {
                setProgress(Math.round((100 * event.loaded) / event.total));
            }
        })
          .then((response) => {
              setCode(response.data.code);
              setMessage(response.data.message);
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
                  <button
                    className={`btn btn-primary ${!period ? 'disabled' : ''}`}
                    onClick={generate}
                  >
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
    param: PropTypes.string.isRequired,
};

export default ProjectionGenerator;
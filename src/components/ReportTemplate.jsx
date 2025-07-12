import React from 'react';
import PropTypes from 'prop-types';
import CustomDatePicker from './CustomDatePicker';
import useReport from '../hooks/useReport';

const LabeledField = ({ label, children }) => (
  <div className="row mb-3">
    <div className="col-md-4 text-end">
      <label className="form-label">{label}</label>
    </div>
    <div className="col-md-8">{children}</div>
  </div>
);
LabeledField.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

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

        <LabeledField label="Código Activo Fijo Principal:">
          <input
            type="text"
            className="form-control-sm"
            value={mainCode}
            onChange={(e) => setMainCode(e.target.value)}
          />
        </LabeledField>

        <LabeledField label="Cuenta Contable del Activo Fijo:">
          <input
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

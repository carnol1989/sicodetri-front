// src/views/TemporaryDeductions.jsx
import React from 'react';
import ProjectionGenerator from '../components/ProjectionGenerator';
import FinancialFixedAssetService from '../services/FinancialFixedAssetService';

const TemporaryDeductions = () => (
  <ProjectionGenerator
    title="Generación de Deducciones Temporales"
    serviceFn={FinancialFixedAssetService.generateTemporaryDeductionsService}
    param="332"
  />
);

export default TemporaryDeductions;

// src/views/TemporaryAdditions.jsx
import React from 'react';
import ProjectionGenerator from '../components/ProjectionGenerator';
import FinancialFixedAssetService from '../services/FinancialFixedAssetService';

const TemporaryAdditions = () => (
  <ProjectionGenerator
    title="Generación de Adiciones Temporales"
    serviceFn={FinancialFixedAssetService.generateTemporaryAdditionsService}
    param="ALL"
  />
);

export default TemporaryAdditions;

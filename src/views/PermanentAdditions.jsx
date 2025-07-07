import React from 'react';
import ProjectionGenerator from '../components/ProjectionGenerator';
import FinancialFixedAssetService from '../services/FinancialFixedAssetService';

const PermanentAdditions = () => (
    <ProjectionGenerator
        title="Generación de Adiciones Permanentes"
        serviceFn={FinancialFixedAssetService.generatePermanentAdditionsService}
        param="332"
    />
);

export default PermanentAdditions;
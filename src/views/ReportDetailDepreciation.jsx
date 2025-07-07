import React from 'react';
import ReportTemplate from '../components/ReportTemplate';

export default function ReportDetailDepreciation() {
    return (
        <ReportTemplate
            title="Reporte: Detalle de Depreciación Financiera y Tributaria"
            option="2"
            withYear={false}
        />
    );
}
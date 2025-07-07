import React from 'react';
import ReportTemplate from '../components/ReportTemplate';

export default function ReportTaxBook() {
    return (
        <ReportTemplate
            title="Reporte: Libro Tributario de Activo Fijos"
            option="1"
            withYear={true}
        />
    );
}
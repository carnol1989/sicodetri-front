import { useState } from 'react';
import { format } from 'date-fns';
import FinancialFixedAssetService from '../services/FinancialFixedAssetService';

export default function useReport(option, withYear) {
    const [progress, setProgress] = useState(0);
    // Sólo presetear un Date para los reportes que NO piden selector de año
    const [year, setYear] = useState(withYear ? null : new Date('1900'));
    const [mainCode, setMainCode] = useState('');
    const [accountingAccount, setAccountingAccount] = useState('');
    const [startAcq, setStartAcq] = useState(null);
    const [endAcq, setEndAcq] = useState(null);
    const [startUse, setStartUse] = useState(null);
    const [endUse, setEndUse] = useState(null);

    // Deshabilita botón hasta que estén todos los campos obligatorios
    const disabled = withYear
        ? !(year && startAcq && endAcq && startUse && endUse)
        : !(startAcq && endAcq && startUse && endUse);

    const generate = async () => {
        setProgress(0);

        // FORMATEO AQUI, con guardas para evitar `null`
        const yearFormat = withYear
            ? format(year, 'yyyy')   // aquí year ya NO es null porque el botón sólo activa cuando year !== null
            : format(year, 'yyyy'); // año `"1900"` por defecto
        const startAcqFmt = format(startAcq, 'yyyy-MM-dd');
        const endAcqFmt   = format(endAcq,   'yyyy-MM-dd');
        const startUseFmt = format(startUse, 'yyyy-MM-dd');
        const endUseFmt   = format(endUse,   'yyyy-MM-dd');

        await FinancialFixedAssetService.generateReportsService(
            option,
            yearFormat,
            mainCode,
            accountingAccount,
            startAcqFmt,
            endAcqFmt,
            startUseFmt,
            endUseFmt,
            (evt) => {
                if (evt.lengthComputable) {
                    setProgress(Math.round((evt.loaded * 100) / evt.total));
                }
            }
        );
    };

    return {
        progress,
        year, setYear,
        mainCode, setMainCode,
        accountingAccount, setAccountingAccount,
        startAcq, setStartAcq,
        endAcq, setEndAcq,
        startUse, setStartUse,
        endUse, setEndUse,
        disabled,
        generate,
    };
}
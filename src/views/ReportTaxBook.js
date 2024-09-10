import React, {useState} from "react";
import FinancialFixedAssetService from "../services/FinancialFixedAssetService";
import CustomDatePicker from "../components/CustomDatePicker";
import "react-datepicker/dist/react-datepicker.css";
import {format} from "date-fns";

const ReportTaxBook = () => {
    const [progress, setProgress] = useState(0);
    const [code, setCode] = useState("");
    const [message, setMessage] = useState("");
    const [option, setOption] = useState("1");
    const [year, setYear] = useState(null);
    const [mainCode, setMainCode] = useState("");
    const [accountingAccount, setAccountingAccount] = useState("");
    const [startAcquisitionDate, setStartAcquisitionDate] = useState(null);
    const [endAcquisitionDate, setEndAcquisitionDate] = useState(null);
    const [startDateUse, setStartDateUse] = useState(null);
    const [endDateUse, setEndDateUse] = useState(null);

    const generateReportTaxBook = async () => {
        setProgress(0);
        const yearFormat = format(year, 'yyyy');
        const startAcquisitionDateFormat = format(startAcquisitionDate, 'yyyy-MM-dd');
        const endAcquisitionDateFormat = format(endAcquisitionDate, 'yyyy-MM-dd');
        const startDateUseFormat = format(startDateUse, 'yyyy-MM-dd');
        const endDateUseFormat = format(endDateUse, 'yyyy-MM-dd');

        await FinancialFixedAssetService.generateReportsService(
            option,
            yearFormat,
            mainCode,
            accountingAccount,
            startAcquisitionDateFormat,
            endAcquisitionDateFormat,
            startDateUseFormat,
            endDateUseFormat,
            (progressEvent) => {
                if (progressEvent.lengthComputable) {
                    const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setProgress(percent);
                }
            }
        );
    };

    return (
        <main className="flex-shrink-0">
            <div className="container">
                <div className="row mb-3">
                    <h3>Reporte: Libro Tributario de Activo Fijos</h3>
                </div>
                <div className="row mb-3">
                    <div className="col-md-4 text-end">
                        <label className="form-label">Seleccione el periodo:</label>
                    </div>
                    <div className="col-md-8">
                        <CustomDatePicker
                            selected={year}
                            onChange={(date) => setYear(date)}
                            dateFormat="yyyy"
                        />
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-4 text-end">
                        <label className="form-label">Código Activo Fijo Principal:</label>
                    </div>
                    <div className="col-md-8">
                        <input
                            type="text"
                            className="form-control-sm"
                            value={mainCode}
                            onChange={(e) => setMainCode(e.target.value)}
                        />
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-4 text-end">
                        <label className="form-label">Cuenta Contable del Activo Fijo:</label>
                    </div>
                    <div className="col-md-8">
                        <input
                            type="text"
                            className="form-control-sm"
                            value={accountingAccount}
                            onChange={(e) => setAccountingAccount(e.target.value)}
                        />
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-4 text-end">
                        <label className="form-label">Fecha de Inicio de Adquisición:</label>
                    </div>
                    <div className="col-md-8">
                        <CustomDatePicker
                            selected={startAcquisitionDate}
                            onChange={(date) => setStartAcquisitionDate(date)}
                            dateFormat="yyyy-MM-dd"
                        />
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-4 text-end">
                        <label className="form-label">Fecha de Fin de Adquisición:</label>
                    </div>
                    <div className="col-md-8">
                        <CustomDatePicker
                            selected={endAcquisitionDate}
                            onChange={(date) => setEndAcquisitionDate(date)}
                            dateFormat="yyyy-MM-dd"
                        />
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-4 text-end">
                        <label className="form-label">Fecha de Inicio de Uso:</label>
                    </div>
                    <div className="col-md-8">
                        <CustomDatePicker
                            selected={startDateUse}
                            onChange={(date) => setStartDateUse(date)}
                            dateFormat="yyyy-MM-dd"
                        />
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-4 text-end">
                        <label className="form-label">Fecha de Fin de Uso:</label>
                    </div>
                    <div className="col-md-8">
                        <CustomDatePicker
                            selected={endDateUse}
                            onChange={(date) => setEndDateUse(date)}
                            dateFormat="yyyy-MM-dd"
                        />
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="progress">
                        <div
                            className="progress-bar progress-bar-info progress-bar-striped"
                            role="progressbar"
                            aria-valuenow={progress}
                            aria-valuemin="0"
                            aria-valuemax="100"
                            style={{width: progress + "%"}}
                        >
                            {progress}%
                        </div>
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="d-flex gap-2">
                        <button
                            className="btn btn-primary"
                            disabled={!year || !startAcquisitionDate || !endAcquisitionDate || !startDateUse || !endDateUse}
                            onClick={generateReportTaxBook}
                        >
                            Exportar
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ReportTaxBook;
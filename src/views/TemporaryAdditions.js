import React, {useState} from "react";
import FinancialFixedAssetService from "../services/FinancialFixedAssetService";
import CustomDatePicker from "../components/CustomDatePicker";
import "react-datepicker/dist/react-datepicker.css";

const TemporaryAdditions = () => {
    const [progress, setProgress] = useState(0);
    const [code, setCode] = useState("");
    const [message, setMessage] = useState("");
    const [period, setPeriod] = useState("");
    const [showAlert, setShowAlert] = useState(false);

    const generateTemporaryAdditions = () => {
        setProgress(0);

        if (!period) {
            setCode("");
            setMessage("Por favor seleccione un periodo.");
            return;
        }

        const periodFormatted = period.toISOString().split('T')[0]; // YYYY-MM-DD

        FinancialFixedAssetService.generateTemporaryAdditionsService(periodFormatted, 'ALL',(event) => {
            if (event.lengthComputable) {
                const progressPercentage = Math.round((100 * event.loaded) / event.total);
                setProgress(progressPercentage);
            }
        })
            .then((response) => {
                setCode(response.data.code);
                setMessage(response.data.message);
            })
            .catch(() => {
                setCode("");
                setProgress(0);
                setMessage("No se pudo generar las deducciones temporales.");
            });

        setShowAlert(true);
    };

    const alertClass = (code === "00" ? "alert alert-success" : "alert alert-danger");

    return (
        <main className="flex-shrink-0">
            <div className="container">
                <div className="row mb-3">
                    <h3>Generación de Adiciones Temporales</h3>
                </div>
                <div className="row">
                    <div className="d-flex gap-2">
                        <label className="form-label">Seleccione el periodo:</label>
                        <CustomDatePicker
                            selected={period}
                            onChange={(date) => setPeriod(date)}
                        />
                    </div>
                </div>

                <div className="row mb-3">
                    {showAlert && (
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
                    )}
                </div>

                <div className="row mb-3">
                    <div className="d-flex gap-2">
                        <button
                            className="btn btn-primary"
                            disabled={!period}
                            onClick={generateTemporaryAdditions}
                        >
                            Generar Proyección
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

export default TemporaryAdditions;
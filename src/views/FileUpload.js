import React, {useState} from "react";
import FinancialFixedAssetService from "../services/FinancialFixedAssetService";
import CustomDatePicker from "../components/CustomDatePicker";
import "react-datepicker/dist/react-datepicker.css";

const FileUpload = () => {
    const [selectedFiles, setSelectedFiles] = useState(undefined);
    const [currentFile, setCurrentFile] = useState(undefined);
    const [progress, setProgress] = useState(0);
    const [code, setCode] = useState("");
    const [message, setMessage] = useState("");
    const [period, setPeriod] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [activeSave, setActiveSave] = useState(true);

    const selectFile = (event) => {
        setSelectedFiles(event.target.files);
    };

    const uploadFile = () => {
        let currentFile = selectedFiles[0];

        setProgress(0);
        setCurrentFile(currentFile);

        if (!period) {
            setCode("");
            setMessage("Por favor seleccione un periodo.");
            return;
        }

        const periodFormatted = period.toISOString().split('T')[0]; // YYYY-MM-DD

        FinancialFixedAssetService.uploadService(currentFile, periodFormatted, (event) => {
            setProgress(Math.round((100 * event.loaded) / event.total));
        })
            .then((response) => {
                setCode(response.data.code);
                setMessage(response.data.message);
                setActiveSave(false);
            })
            .catch(() => {
                setCode("");
                setProgress(0);
                setMessage("No se pudo subir el archivo.");
                setCurrentFile(undefined);
                setSelectedFiles(undefined);
                setActiveSave(true);
            });

        setShowAlert(true);
    };

    const saveDataFile = () => {
        setProgress(0);

        if (!period) {
            setCode("");
            setMessage("Por favor seleccione un periodo.");
            return;
        }

        const periodFormatted = period.toISOString().split('T')[0]; // YYYY-MM-DD

        FinancialFixedAssetService.saveService(periodFormatted, (event) => {
            setProgress(Math.round((100 * event.loaded) / event.total));
        })
            .then((response) => {
                setCode(response.data.code);
                setMessage(response.data.message);
            })
            .catch(() => {
                setCode("");
                setProgress(0);
                setMessage("No se pudo guardar la información.");
                setCurrentFile(undefined);
                setSelectedFiles(undefined);
            });

        setShowAlert(true);
    };

    const alertClass = (code === "00" ? "alert alert-success" : "alert alert-danger");

    return (
        <main className="flex-shrink-0">
            <div className="container">
                <div className="row mb-3">
                    <h3>Cargar Excel de Activo Fijos</h3>
                </div>
                <div className="row">
                    <div className="d-flex gap-2">
                        <label className="form-label">Seleccione el periodo:</label>
                        <CustomDatePicker
                            selected={period}
                            onChange={(date) => setPeriod(date)}
                            dateFormat="yyyy-MM"
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col">
                        <label htmlFor="formFile" className="form-label"></label>
                        <input id="formFile" className="form-control" type="file" onChange={selectFile}/>
                    </div>
                </div>

                <div className="row mb-3">
                    {currentFile && (
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
                            disabled={!selectedFiles || !period}
                            onClick={uploadFile}
                        >
                            Subir Archivo
                        </button>
                        <button
                            className="btn btn-primary"
                            disabled={!selectedFiles || !period || activeSave}
                            onClick={saveDataFile}
                        >
                            Guardar Información
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

export default FileUpload;
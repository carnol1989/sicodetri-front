// src/components/FileUpload.js

import React, { useState } from "react";
import FinancialFixedAssetService from "../services/FinancialFixedAssetService";
import CustomDatePicker from "./CustomDatePicker"; // Asegúrate de la ruta correcta
import "react-datepicker/dist/react-datepicker.css";

const UploadFiles = () => {
    const [selectedFiles, setSelectedFiles] = useState(undefined);
    const [currentFile, setCurrentFile] = useState(undefined);
    const [progress, setProgress] = useState(0);
    const [code, setCode] = useState("");
    const [message, setMessage] = useState("");
    const [period, setPeriod] = useState("");
    const [showAlert, setShowAlert] = useState(false);

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
            })
            .catch(() => {
                setCode("");
                setProgress(0);
                setMessage("No se pudo subir el archivo.");
                setCurrentFile(undefined);
            });

        setShowAlert(true);
        setSelectedFiles(undefined);
    };

    const alertClass = (code === "00" ? "alert alert-success" : "alert alert-danger");

    return (
        <div>
            <div className="form-group">
                <label htmlFor="period" className="form-label">Seleccione el periodo:</label>
                <CustomDatePicker
                    selected={period}
                    onChange={(date) => setPeriod(date)}
                />
            </div>

            <div className="form-group">
                <label className="btn btn-default">
                    <input type="file" onChange={selectFile} />
                </label>
            </div>

            {currentFile && (
                <div className="progress">
                    <div
                        className="progress-bar progress-bar-info progress-bar-striped"
                        role="progressbar"
                        aria-valuenow={progress}
                        aria-valuemin="0"
                        aria-valuemax="100"
                        style={{ width: progress + "%" }}
                    >
                        {progress}%
                    </div>
                </div>
            )}

            <button
                className="btn btn-success"
                disabled={!selectedFiles || !period}
                onClick={uploadFile}
            >
                Upload
            </button>

            {showAlert && (
                <div className={alertClass} role="alert">
                    {message}
                </div>
            )}
        </div>
    );
};

export default UploadFiles;
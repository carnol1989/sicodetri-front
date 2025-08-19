/**
 * Financial Fixed Asset Service for SICODETRI-FRONT. <br/>
 * Provides API integration methods for uploading, saving, generating projections,
 * and downloading reports related to financial fixed assets. <br/>
 * Path: src/services/FinancialFixedAssetService.js
 *
 * @module FinancialFixedAssetService
 * @requires module:../http-common
 *
 * <b>Component</b>: {@link FinancialFixedAssetService} <br/>
 * <b>Copyright</b>: &copy; 2024 EPS Grau. <br/>
 * <b>Company</b>: EPS Grau. <br/>
 *
 * @author EPS Grau
 * <br/>
 * <u>Service Provider</u>: Consultor TI <br/>
 * <u>Developed by</u>: <br/>
 * <ul>
 *   <li>Carlos Augusto Nole Machaca</li>
 * </ul>
 * <u>Changes</u>: <br/>
 * <ul>
 *   <li>Jun 06, 2025 (JS) Service creation.</li>
 * </ul>
 *
 * @version 1.0
 */
import http from '../http-common';

/**
 * Uploads an Excel file with financial fixed assets for a given period.
 *
 * @function uploadService
 * @param {File} file - Excel file to be uploaded.
 * @param {string} period - Period in YYYY-MM-DD format.
 * @param {function} onUploadProgress - Callback to track upload progress.
 * @returns {Promise.<AxiosResponse>} Axios response with status and message.
 */
const uploadService = (file, period, onUploadProgress) => {
  let formData = new FormData();
  formData.append('file', file);
  const url = `${process.env.REACT_APP_URL_API_FINANCIAL_FIXED_ASSETS}/upload?period=${encodeURIComponent(period)}`;
  return http.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  });
};

/**
 * Saves the uploaded financial fixed asset data for a given period.
 *
 * @function saveService
 * @param {string} period - Period in YYYY-MM-DD format.
 * @param {function} onUploadProgress - Callback to track save progress.
 * @returns {Promise.<AxiosResponse>} Axios response with status and message.
 */
const saveService = (period, onUploadProgress) => {
  const url = `${process.env.REACT_APP_URL_API_FINANCIAL_FIXED_ASSETS}?period=${encodeURIComponent(period)}`;
  return http.post(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    onUploadProgress,
  });
};

/**
 * Generates projections for temporary deductions of fixed assets.
 *
 * @function generateTemporaryDeductionsService
 * @param {string} period - Period in YYYY-MM-DD format.
 * @param {string} account - Accounting account code.
 * @param {function} onUploadProgress - Callback to track request progress.
 * @returns {Promise.<AxiosResponse>} Axios response with projection data.
 */
const generateTemporaryDeductionsService = (period, account, onUploadProgress) => {
  const url = `${process.env.REACT_APP_URL_API_FINANCIAL_FIXED_ASSETS}/projection?type=TEMPORARY_DEDUCTIONS&period=${encodeURIComponent(period)}&account=${encodeURIComponent(account)}`;
  return http.post(
    url,
    {},
    {
      headers: {
        'Content-Type': 'application/json',
      },
      onUploadProgress,
    },
  );
};

/**
 * Generates projections for temporary additions of fixed assets.
 *
 * @function generateTemporaryAdditionsService
 * @param {string} period - Period in YYYY-MM-DD format.
 * @param {string} account - Accounting account code.
 * @param {function} onUploadProgress - Callback to track request progress.
 * @returns {Promise.<AxiosResponse>} Axios response with projection data.
 */
const generateTemporaryAdditionsService = (period, account, onUploadProgress) => {
  const url = `${process.env.REACT_APP_URL_API_FINANCIAL_FIXED_ASSETS}/projection?type=TEMPORARY_ADDITIONS&period=${encodeURIComponent(period)}&account=${encodeURIComponent(account)}`;
  return http.post(
    url,
    {},
    {
      headers: {
        'Content-Type': 'application/json',
      },
      onUploadProgress,
    },
  );
};

/**
 * Generates projections for permanent additions of fixed assets.
 *
 * @function generatePermanentAdditionsService
 * @param {string} period - Period in YYYY-MM-DD format.
 * @param {string} account - Accounting account code.
 * @param {function} onUploadProgress - Callback to track request progress.
 * @returns {Promise.<AxiosResponse>} Axios response with projection data.
 */
const generatePermanentAdditionsService = (period, account, onUploadProgress) => {
  const url = `${process.env.REACT_APP_URL_API_FINANCIAL_FIXED_ASSETS}/projection?type=PERMANENT_ADDITIONS&period=${encodeURIComponent(period)}&account=${encodeURIComponent(account)}`;
  return http.post(
    url,
    {},
    {
      headers: {
        'Content-Type': 'application/json',
      },
      onUploadProgress,
    },
  );
};

/**
 * Generates and downloads financial fixed asset reports. <br/>
 * Supports filters by option, year, asset code, account, acquisition/use dates. <br/>
 * Downloads the report as an Excel file (`.xlsx`).
 *
 * @async
 * @function generateReportsService
 * @param {string} option - Report option (e.g., '1' = Tax Book, '2' = Depreciation Detail).
 * @param {string} year - Year for filtering report data.
 * @param {string} mainCode - Main fixed asset code.
 * @param {string} accountingAccount - Accounting account number.
 * @param {string} startAcquisitionDate - Start date of acquisition filter.
 * @param {string} endAcquisitionDate - End date of acquisition filter.
 * @param {string} startDateUse - Start date of use filter.
 * @param {string} endDateUse - End date of use filter.
 * @param {function} onDownloadProgress - Callback to track download progress.
 * @returns {Promise.<void>} Downloads the report as a file on the client.
 * @throws {Error} When the report cannot be generated or downloaded.
 */
const generateReportsService = async (
  option,
  year,
  mainCode,
  accountingAccount,
  startAcquisitionDate,
  endAcquisitionDate,
  startDateUse,
  endDateUse,
  onDownloadProgress,
) => {
  // Define los parámetros
  const params = {
    option: option,
    fileType: 'xlsx',
    year: year,
    mainCode: mainCode,
    accountingAccount: accountingAccount,
    startAcquisitionDate: startAcquisitionDate,
    endAcquisitionDate: endAcquisitionDate,
    startDateUse: startDateUse,
    endDateUse: endDateUse,
  };

  // Codifica cada valor de parámetro
  const encodedParams = Object.keys(params)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');

  // Construye la URL
  const url = `${process.env.REACT_APP_URL_API_FINANCIAL_FIXED_ASSETS}/report?${encodedParams}`;

  try {
    // Realiza la solicitud GET para descargar el archivo
    const response = await http.get(url, {
      responseType: 'blob',
      onDownloadProgress: (progressEvent) => {
        if (onDownloadProgress) {
          onDownloadProgress(progressEvent);
        }
      },
    });
    // Accede a los headers
    const headers = response.headers;

    // Puedes obtener valores específicos de los headers, por ejemplo:
    const contentDisposition = headers['content-disposition'];

    // Crea una URL para el archivo
    const fileURL = window.URL.createObjectURL(response.data);
    const a = document.createElement('a');
    a.setAttribute('style', 'display:none');
    document.body.appendChild(a);

    // Si quieres obtener el nombre del archivo del header "Content-Disposition"
    let fileName = 'archivo.xlsx';
    if (contentDisposition) {
      const fileNameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (fileNameMatch !== null && fileNameMatch !== undefined) fileName = fileNameMatch[1];
    }

    a.href = fileURL;
    a.download = fileName;
    a.click();
  } catch (error) {
    console.error('Error descargando el archivo:', error);
    throw new Error('Error al descargar el reporte');
  }
};

/**
 * Collection of services to interact with Financial Fixed Asset backend API.
 *
 * @namespace FinancialFixedAssetService
 */
const FinancialFixedAssetService = {
  uploadService,
  saveService,
  generateTemporaryDeductionsService,
  generateTemporaryAdditionsService,
  generatePermanentAdditionsService,
  generateReportsService,
};

export default FinancialFixedAssetService;

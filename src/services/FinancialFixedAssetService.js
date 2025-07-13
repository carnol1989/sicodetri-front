// src/services/FinancialFixedAssetService.js
import http from '../http-common';

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

const saveService = (period, onUploadProgress) => {
  const url = `${process.env.REACT_APP_URL_API_FINANCIAL_FIXED_ASSETS}?period=${encodeURIComponent(period)}`;
  return http.post(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    onUploadProgress,
  });
};

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

const FinancialFixedAssetService = {
  uploadService,
  saveService,
  generateTemporaryDeductionsService,
  generateTemporaryAdditionsService,
  generatePermanentAdditionsService,
  generateReportsService,
};

export default FinancialFixedAssetService;

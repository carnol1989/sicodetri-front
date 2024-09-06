import http from "../http-commom";

const uploadService = (file, period, onUploadProgress) => {
  let formData = new FormData();
  formData.append("file", file);
  const url = `${process.env.REACT_APP_URL_API_FINANCIAL_FIXED_ASSETS}/upload?period=${encodeURIComponent(period)}`;
  return http.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress,
  });
};

const saveService = (period, onUploadProgress) => {
  const url = `${process.env.REACT_APP_URL_API_FINANCIAL_FIXED_ASSETS}?period=${encodeURIComponent(period)}`;
  return http.post(url, {
    headers: {
      "Content-Type": "application/json",
    },
    onUploadProgress,
  });
}

const generateTemporaryDeductionsService = (period, account, onUploadProgress) => {
  const url = `${process.env.REACT_APP_URL_API_FINANCIAL_FIXED_ASSETS}/projection?period=${encodeURIComponent(period)}&account=${encodeURIComponent(account)}`;
  return http.post(url, {
    headers: {
      "Content-Type": "application/json",
    },
    onUploadProgress,
  });
}

const FinancialFixedAssetService = {
  uploadService,
  saveService,
  generateTemporaryDeductionsService
};

export default FinancialFixedAssetService;
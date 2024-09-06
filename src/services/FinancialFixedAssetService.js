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

const saveService = () => {
  return null;
}

const projectionService = () => {
  return null;
}

const FinancialFixedAssetService = {
  uploadService,
  saveService,
  projectionService
};

export default FinancialFixedAssetService;
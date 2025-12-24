// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: process.env.REACT_APP_API_URL,
// });

// export default axiosInstance;


import axios from "axios";

// Dynamically determine base URL based on current hostname
// Relative URL for Nginx proxy
const getBaseUrl = () => {
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:5002/api';
  }
  return '/api';
};

let baseUrl = import.meta.env.VITE_API_URL || getBaseUrl();
const axiosInstance = axios.create({
  baseURL: baseUrl,
});
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;

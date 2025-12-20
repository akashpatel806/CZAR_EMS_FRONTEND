// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: process.env.REACT_APP_API_URL,
// });

// export default axiosInstance;


import axios from "axios";

// Dynamically determine base URL based on current hostname
// Relative URL for Nginx proxy
const getBaseUrl = () => {
  return '/api';
};

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || getBaseUrl(),
});
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;

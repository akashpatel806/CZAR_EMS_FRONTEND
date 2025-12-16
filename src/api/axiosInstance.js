// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: process.env.REACT_APP_API_URL,
// });

// export default axiosInstance;


import axios from "axios";

// Dynamically determine base URL based on current hostname
const getBaseUrl = () => {
  const hostname = window.location.hostname;

  // If accessing via IP address (network), use the same IP for API
  if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
    return `http://${hostname}:5002/api`;
  }

  // Default to localhost
  return 'http://localhost:5002/api';
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

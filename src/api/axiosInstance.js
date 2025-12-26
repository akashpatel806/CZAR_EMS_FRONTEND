// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: process.env.REACT_APP_API_URL,
// });

// export default axiosInstance;


import axios from "axios";
import { API_BASE_URL } from "../utils/attendanceUtils";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;

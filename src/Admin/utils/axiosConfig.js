import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api/admin", // Backend API URL
});

export default axiosInstance;

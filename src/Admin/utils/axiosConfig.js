import axios from "axios";

const axiosConfig = axios.create({
  baseURL: "http://localhost:5000/api", // Update with your backend API URL
});

export default axiosConfig;

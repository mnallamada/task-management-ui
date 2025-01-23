import axios from "axios";

// Create an Axios instance with the backend base URL
const API = axios.create({
  baseURL: "https://taskmanager-api.mounikanallamada.com",
});

// Add a request interceptor to include the Authorization token in headers
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Retrieve token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Attach token to Authorization header
    }
    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle responses globally
API.interceptors.response.use(
  (response) => response, // Pass through successful responses
  (error) => {
    // Handle response errors (e.g., unauthorized)
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized: Redirecting to login page");
      localStorage.removeItem("token"); // Clear token on unauthorized error
      window.location.href = "/login"; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

export default API;

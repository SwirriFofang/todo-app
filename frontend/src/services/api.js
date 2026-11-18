import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Attach the token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the token has expired or is invalid, log the user out
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const hadToken = localStorage.getItem("token");
    if (
      error.response?.status === 401 &&
      hadToken &&
      window.location.pathname !== "/login"
    ) {
      localStorage.removeItem("token");
      window.location.assign("/login");
    }
    return Promise.reject(error);
  }
);

// Turns any error into a message we can show the user
export const getErrorMessage = (error) =>
  error.response?.data?.message || "Something went wrong. Please try again.";

export default api;
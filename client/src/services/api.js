import axios from "axios";

// In local dev, Vite proxies /api to localhost:5000 (see vite.config.js).
// In production (e.g. Vercel), set VITE_API_URL to your deployed backend,
// e.g. https://hirehub-server.onrender.com/api
const baseURL = import.meta.env.VITE_API_URL || "/api";
const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("hirehub_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;

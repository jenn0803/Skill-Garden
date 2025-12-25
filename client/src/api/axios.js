import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("sg_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ✅ Add this helper wrapper function
export async function apiRequest(endpoint, method = "GET", data = null) {
  try {
    const res = await api.request({
      url: endpoint,
      method,
      data,
    });
    return res.data;
  } catch (err) {
    console.error("API error:", err);
    throw err;
  }
}

export default api;

import axios from "axios";
import { getAuth } from "firebase/auth";

// Base URL of your backend API
const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_LINK || "https://cribnconnect-api.onrender.com",
});

// Add Firebase token to requests
api.interceptors.request.use(async (config) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    // Optionally handle error
  }
  return config;
});

export default api;
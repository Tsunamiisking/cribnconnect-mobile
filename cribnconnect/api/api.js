import axios from "axios";
import { getAuth } from "firebase/auth";

// Base URL of your backend API
const api = axios.create({
  baseURL: "https://cribnconnect-api.onrender.com/api",
  // timeout: 10000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});

// Add Firebase token to requests
api.interceptors.request.use(async (config) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (user) {
      const token = await user.getIdToken(true); // Force refresh token
      config.headers.Authorization = `Bearer ${token}`;
      
      // Log the full request details
      // console.log('Full request details:', {
      //   fullUrl: `${config.baseURL}${config.url}`,
      //   method: config.method,
      //   headers: config.headers,
      //   uid: user.uid
      // });
    } else {
      console.warn('No authenticated user found');
    }
  } catch (error) {
    console.error('Error in request interceptor:', error);
  }
  return config;
}, (error) => {
  console.error('Request interceptor error:', error);
  return Promise.reject(error);
});

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('Response:', {
      status: response.status,
      url: response.config.url
    });
    return response;
  },
  (error) => {
    console.error('Response error:', {
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

export default api;
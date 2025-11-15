import axios from "axios";
import { getAuth } from "firebase/auth";

// Base URL of your backend API
const api = axios.create({
  baseURL: "https://cribnconnect-api.onrender.com/api",
  // timeout: 10000,
  headers: {
    'Accept': 'application/json',
  }
});

// Add Firebase token to requests
api.interceptors.request.use(async (config) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (user) {
      const token = await user.getIdToken(true); // Force refresh token
      // console.log('Token:', token);
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
  // If we're sending FormData, ensure Content-Type is not forced so the
  // browser / RN runtime / axios can set the correct multipart boundary.
  // This helps servers (multer) parse uploaded files correctly.
  try {
    // Robust FormData detection:
    // - web: FormData instanceof works
    // - react-native: config.data._parts exists or data.append function present
    const isFormData = (
      (typeof FormData !== 'undefined' && config && config.data && config.data instanceof FormData) ||
      (config && config.data && typeof config.data.append === 'function') ||
      (config && config.data && Array.isArray(config.data._parts))
    );

    if (isFormData && config.headers) {
      // Delete Content-Type in a case-insensitive way so axios/runtime can
      // set the correct multipart boundary. Some libs use 'content-type'.
      if (config.headers['Content-Type']) delete config.headers['Content-Type'];
      if (config.headers['content-type']) delete config.headers['content-type'];
    }
  } catch (e) {
    // Ignore — defensive in case FormData isn't available in some envs
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
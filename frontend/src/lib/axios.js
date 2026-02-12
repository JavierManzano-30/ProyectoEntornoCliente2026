import axios from 'axios';
import { API_BASE_URL } from '../config/api';

// Configurar instancia de axios
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir token a las peticiones
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
axiosInstance.interceptors.response.use(
  (response) => {
    // Desempaquetar envelope pattern del backend
    // Si la respuesta tiene { success: true, data: {...} }, extraer solo data
    if (response.data && response.data.success === true && 'data' in response.data) {
      response.data = response.data.data;
    }
    return response;
  },
  async (error) => {
    // Si el token ha expirado o es inválido, limpiar y redirigir al login
    if (error.response?.status === 401) {
      // Limpiar tokens y datos de sesión
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('companyId');
      localStorage.removeItem('roleId');
      
      // Redirigir al login solo si no estamos ya en login
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

import axios from 'axios';
import { obtenerSesion } from './authService';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

api.interceptors.request.use((config) => {
    const sesion = obtenerSesion();
    if (sesion?.token) {
        config.headers.Authorization = `Bearer ${sesion.token}`;
    }
    return config;
});

export default api;

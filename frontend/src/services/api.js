import axios from 'axios';

// Creamos una instancia de axios configurada
const api = axios.create({
    baseURL: 'http://localhost:3000', // La URL de tu backend de Express
});

// Este interceptor añadirá el Token automáticamente en cada petición
api.interceptors.request.use(async (config) => {
    // Aquí es donde leeremos el token de la sesión de Supabase
    // para enviárselo a nuestro "guardaespaldas" en el backend
    const session = JSON.parse(localStorage.getItem('sb-tu-proyecto-auth-token')); // Ejemplo
    if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    return config;
});

export default api;
import axios from 'axios';

// const API = axios.create({
//     baseURL: 'http://localhost:5000',
// });

const API = axios.create({ baseURL: '/api' })

// Axios Request Interceptor
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    
    if (token) {
        // Adds the token to the Authorization header
        // The "Bearer" prefix is a standard convention for JWT
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Optional: Response Interceptor to handle expired tokens
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // If the server says the token is invalid or expired, log the user out
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default API;
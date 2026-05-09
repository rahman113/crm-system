import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://crm-system-175m.onrender.com';
console.log(API_URL)

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use(
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

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle session expiration
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth services
export const register = (userData) => api.post('/api/auth/register', userData);
export const login = (userData) => api.post('/api/auth/login', userData);
export const getCurrentUser = () => api.get('/api/auth/me');

// Lead services
export const getLeads = (statusFilter = '') => {
    const url = statusFilter ? `/api/leads?status=${statusFilter}` : '/api/leads';
    return api.get(url);
};
export const getLead = (id) => api.get(`/api/leads/${id}`);
export const createLead = (leadData) => api.post('/api/leads', leadData);
export const updateLead = (id, leadData) => api.put(`/api/leads/${id}`, leadData);
export const deleteLead = (id) => api.delete(`/api/leads/${id}`);

export default api;
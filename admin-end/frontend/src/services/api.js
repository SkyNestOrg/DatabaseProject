import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token if available
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('adminToken');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

// Admin authentication
export const adminLogin = (credentials) => api.post('/auth/admin-login', credentials);

// Staff management
export const fetchStaff = () => api.get('/staff');
export const createStaff = (staffData) => api.post('/staff', staffData);
export const updateStaff = (username, staffData) => api.put(`/staff/${username}`, staffData);
export const deleteStaff = (username) => api.delete(`/staff/${username}`);

// Logs
export const fetchLogs = (filters = {}) => api.get('/logs', { params: filters });

// Taxes and charges
export const fetchCurrentTaxes = () => api.get('/taxes/current');
export const fetchTaxHistory = () => api.get('/taxes/history');
export const updateTaxes = (taxData) => api.post('/taxes', taxData);

// Discounts
export const fetchDiscounts = () => api.get('/discounts');
export const createDiscount = (discountData) => api.post('/discounts', discountData);
export const updateDiscount = (id, discountData) => api.put(`/discounts/${id}`, discountData);
export const deleteDiscount = (id) => api.delete(`/discounts/${id}`);

// Additional data
export const fetchBranches = () => api.get('/staff/branches');
export const fetchRoomTypes = () => api.get('/staff/room-types');

export default api;
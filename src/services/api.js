import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Request Interceptor to add Token
API.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
});

// APIs
export const fetchTransactions = () => API.get('/transactions');
export const createTransaction = (newTransaction) => API.post('/transactions', newTransaction);
export const updateTransaction = (id, updatedTransaction) => API.put(`/transactions/${id}`, updatedTransaction);
export const deleteTransaction = (id) => API.delete(`/transactions/${id}`);

// Budget APIs
export const fetchBudgets = (month) => API.get(`/budgets?month=${month}`);
export const createBudget = (newBudget) => API.post('/budgets', newBudget);
export const updateBudget = (id, updatedBudget) => API.put(`/budgets/${id}`, updatedBudget);
export const deleteBudget = (id) => API.delete(`/budgets/${id}`);

export default API;

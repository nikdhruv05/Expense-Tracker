import axios from 'axios';

// In local dev, Vite proxy forwards /api → localhost:5001
// In production (Vercel), VITE_API_URL points to the deployed backend URL
const API_BASE = `${import.meta.env.VITE_API_URL || ''}/api/expenses`;

export const getExpenses = (params = {}) => axios.get(API_BASE, { params });

export const addExpense = (data) => axios.post(API_BASE, data);

export const deleteExpense = (id) => axios.delete(`${API_BASE}/${id}`);


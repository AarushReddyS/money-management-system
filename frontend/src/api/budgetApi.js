import axiosClient from './axiosClient';

export const budgetApi = {
  getAll: () => axiosClient.get('/budgets'),
  getCurrent: () => axiosClient.get('/budgets/current'),
  getByYearMonth: (year, month) => axiosClient.get(`/budgets/${year}/${month}`),
  getComparison: (year, month) => axiosClient.get('/budgets/comparison', { params: { year, month } }),
  saveBudget: (data) => axiosClient.post('/budgets', data),
  delete: (id) => axiosClient.delete(`/budgets/${id}`),
};


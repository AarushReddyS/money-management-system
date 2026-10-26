import axiosClient from './axiosClient';

export const dashboardApi = {
  getSummary: () => axiosClient.get('/dashboard/summary'),
  getTrends: (months = 6) => axiosClient.get('/dashboard/trends', { params: { months } }),
  getExpenseCategories: (year, month) => axiosClient.get('/dashboard/categories/expenses', { params: { year, month } }),
  getIncomeCategories: (year, month) => axiosClient.get('/dashboard/categories/incomes', { params: { year, month } }),
};


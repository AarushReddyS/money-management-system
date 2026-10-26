import axiosClient from './axiosClient';

export const billApi = {
  getAll: (params) => axiosClient.get('/bills', { params }),
  getUpcoming: (daysAhead = 14) => axiosClient.get('/bills/upcoming', { params: { daysAhead } }),
  getById: (id) => axiosClient.get(`/bills/${id}`),
  create: (data) => axiosClient.post('/bills', data),
  update: (id, data) => axiosClient.put(`/bills/${id}`, data),
  updateStatus: (id, status) => axiosClient.patch(`/bills/${id}/status`, { status }),
  markAsPaid: (id) => axiosClient.post(`/bills/${id}/pay`),
  delete: (id) => axiosClient.delete(`/bills/${id}`),
};


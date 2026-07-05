import API from './axios';

export const authAPI = {
  login: (username, password) => API.post('/auth/login/', { username, password }),
  register: (data) => API.post('/auth/register/', data),
  refresh: (refresh) => API.post('/auth/refresh/', { refresh }),
};

export const userAPI = {
  getProfile: () => API.get('/profile/'),
  getDashboard: () => API.get('/dashboard/'),
  getSiteConfig: () => API.get('/config/'),
  stack: () => API.post('/stack/'),
  getStackLogs: () => API.get('/stack/logs/'),
  getDeposits: () => API.get('/deposits/list/'),
  createDeposit: (formData) => API.post('/deposits/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getWithdrawals: () => API.get('/withdrawals/list/'),
  createWithdrawal: (data) => API.post('/withdrawals/', data),
  getTransactions: () => API.get('/transactions/'),
  getNotifications: () => API.get('/notifications/'),
  markNotificationRead: (id) => API.post(`/notifications/${id}/read/`),
  getMarket: (timeframe = '15m') => API.get('/market/', { params: { timeframe } }),
  sendContactMessage: (data) => API.post('/contact/', data),
  getContactMessages: () => API.get('/contact/list/'),
};

export const adminAPI = {
  getDashboard: () => API.get('/admin/dashboard/'),
  getConfig: () => API.get('/admin/config/'),
  updateConfig: (data) => API.patch('/admin/config/', data),
  getUsers: () => API.get('/admin/users/'),
  getUser: (id) => API.get(`/admin/users/${id}/`),
  updateUser: (id, data) => API.patch(`/admin/users/${id}/`, data),
  notifyUser: (id, data) => API.post(`/admin/users/${id}/notify/`, data),
  getDeposits: () => API.get('/admin/deposits/'),
  getWithdrawals: () => API.get('/admin/withdrawals/'),
  getTransactions: () => API.get('/admin/transactions/'),
  approveDeposit: (id) => API.post(`/admin/deposits/${id}/approve/`),
  rejectDeposit: (id) => API.post(`/admin/deposits/${id}/reject/`),
  approveWithdrawal: (id) => API.post(`/admin/withdrawals/${id}/approve/`),
  rejectWithdrawal: (id) => API.post(`/admin/withdrawals/${id}/reject/`),
  getContactMessages: () => API.get('/admin/contact-messages/'),
  markContactRead: (id) => API.post(`/admin/contact-messages/${id}/read/`),
};

export default API;

import API from './axios';

async function requestWithAdminAccountFallback(primaryCall, fallbackCall) {
  try {
    return await primaryCall();
  } catch (err) {
    if (err.response?.status === 404) {
      return fallbackCall();
    }
    throw err;
  }
}

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
  getAdminAccount: () => requestWithAdminAccountFallback(
    () => API.get('/admin/account/'),
    async () => {
      try {
        return await API.get('/admin/config/account/');
      } catch (err) {
        if (err.response?.status === 404) {
          const dash = await API.get('/admin/dashboard/');
          return { data: dash.data.admin_accounts };
        }
        throw err;
      }
    },
  ),
  createAdminAccount: (data) => requestWithAdminAccountFallback(
    () => API.post('/admin/account/', data),
    () => API.post('/admin/config/', { action: 'create_admin_account', ...data }),
  ),
  updateAdminAccount: (data) => requestWithAdminAccountFallback(
    () => API.patch('/admin/account/', data),
    async () => {
      try {
        return await API.patch('/admin/config/account/', data);
      } catch (err) {
        if (err.response?.status === 404) {
          try {
            return await API.patch('/admin/config/', { action: 'update_admin_account', ...data });
          } catch (configErr) {
            if (configErr.response?.status === 404) {
              const adminId = data.admin_id;
              const payload = { username: data.username };
              if (data.password) {
                payload.password = data.password;
                payload.confirm_password = data.confirm_password;
              }
              return API.patch(`/admin/users/${adminId}/`, payload);
            }
            throw configErr;
          }
        }
        throw err;
      }
    },
  ),
};

export default API;

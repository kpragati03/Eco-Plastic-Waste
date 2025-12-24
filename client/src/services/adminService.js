import api from './api';

export const adminService = {
  // Dashboard
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
  },

  // User management
  getUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  updateUserStatus: async (id, statusData) => {
    const response = await api.put(`/admin/users/${id}/status`, statusData);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  // Campaign management
  getPendingCampaigns: async () => {
    const response = await api.get('/admin/campaigns/pending');
    return response.data;
  },

  updateCampaignStatus: async (id, statusData) => {
    const response = await api.put(`/admin/campaigns/${id}/status`, statusData);
    return response.data;
  },

  // Resource management
  getPendingResources: async () => {
    const response = await api.get('/admin/resources/pending');
    return response.data;
  },

  updateResourceStatus: async (id, statusData) => {
    const response = await api.put(`/admin/resources/${id}/status`, statusData);
    return response.data;
  },

  // Agency management
  getPendingAgencies: async () => {
    const response = await api.get('/admin/agencies/pending');
    return response.data;
  },

  updateAgencyStatus: async (id, statusData) => {
    const response = await api.put(`/admin/agencies/${id}/status`, statusData);
    return response.data;
  },

  // Audit logs
  getAuditLogs: async (params = {}) => {
    const response = await api.get('/admin/audit-logs', { params });
    return response.data;
  }
};
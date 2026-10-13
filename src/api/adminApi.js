import axiosClient from './axiosClient';

export const adminApi = {
  createLocation: async (locationData) => {
    const response = await axiosClient.post('/admin/locations', locationData);
    return response.data;
  },

  updateLocation: async (id, locationData) => {
    const response = await axiosClient.put(`/admin/locations/${id}`, locationData);
    return response.data;
  },

  deleteLocation: async (id) => {
    await axiosClient.delete(`/admin/locations/${id}`);
  },

  createConnection: async (connectionData) => {
    const response = await axiosClient.post('/admin/connections', connectionData);
    return response.data;
  },

  deleteConnection: async (id) => {
    await axiosClient.delete(`/admin/connections/${id}`);
  },

  getAuditLogs: async () => {
    const response = await axiosClient.get('/admin/audit-logs');
    return response.data;
  },

  getUsers: async () => {
    const response = await axiosClient.get('/admin/users');
    return response.data;
  },

  deleteUser: async (id) => {
    await axiosClient.delete(`/admin/users/${id}`);
  },
};

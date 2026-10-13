import axiosClient from './axiosClient';

export const locationApi = {
  getAllLocations: async (params = {}) => {
    const response = await axiosClient.get('/locations', { params });
    return response.data;
  },

  getLocationById: async (id) => {
    const response = await axiosClient.get(`/locations/${id}`);
    return response.data;
  },

  getLocationsByCategory: async (category) => {
    const response = await axiosClient.get('/locations', { params: { category } });
    return response.data;
  },

  searchLocations: async (query) => {
    const response = await axiosClient.get('/locations', { params: { query } });
    return response.data;
  },

  getBuildings: async () => {
    const response = await axiosClient.get('/buildings');
    return response.data;
  },

  getFacilities: async () => {
    const response = await axiosClient.get('/facilities');
    return response.data;
  },
};

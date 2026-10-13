import axiosClient from './axiosClient';

export const navigationApi = {
  calculateRoute: async (sourceLocationId, destinationLocationId, accessibleOnly = false) => {
    const response = await axiosClient.post('/navigation/route', {
      sourceLocationId,
      destinationLocationId,
      accessibleOnly,
    });
    return response.data;
  },

  getAllConnections: async () => {
    const response = await axiosClient.get('/navigation/connections');
    return response.data;
  },

  saveRoute: async (sourceId, destinationId, title) => {
    const response = await axiosClient.post(
      `/navigation/save-route?sourceId=${sourceId}&destinationId=${destinationId}&title=${encodeURIComponent(title)}`
    );
    return response.data;
  },

  getSavedRoutes: async () => {
    const response = await axiosClient.get('/navigation/saved-routes');
    return response.data;
  },

  deleteSavedRoute: async (id) => {
    await axiosClient.delete(`/navigation/saved-routes/${id}`);
  },
};

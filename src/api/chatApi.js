import axiosClient from './axiosClient';

export const chatApi = {
  sendMessage: async (message, currentLocationId = null) => {
    const response = await axiosClient.post('/chat', {
      message,
      currentLocationId,
    });
    return response.data;
  },
};

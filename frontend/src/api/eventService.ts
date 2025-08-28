import axiosInstance from './axios';

export const fetchEvents = async (currentPage: number) => {
  const response = await axiosInstance.get(`api/public/events?page=${currentPage}`);
  return response.data;
};

export const createEvent = async (eventData: any) => {
  const response = await axiosInstance.post('/api/events', eventData);
  return response.data;
};

export const updateEvent = async (id: string, eventData: any) => {
  const response = await axiosInstance.put(`/api/events/${id}`, eventData);
  return response.data;
};

export const deleteEvent = async (id: string) => {
  const response = await axiosInstance.delete(`/api/events/${id}`);
  return response.data;
};
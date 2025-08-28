import axios from 'axios';
import axiosInstance from './axios';
import {User} from "../types/user"

export const login = async (email: string, password: string) => {
  const response = await axiosInstance.post('/api/auth/login', { email, password });
  return response.data;
};

export const register = async (email: string, name: string, password: string) => {
  const response = await axiosInstance.post('/api/auth/register', { email, name, password});
  return response.data;
};

export const getUser = async (): Promise<User> => {
  const response = await axiosInstance.get('/api/auth/me');
  return response.data.user;
};

export const logout = () => {
  localStorage.removeItem('authToken');
};

export const verifyToken = async (): Promise<boolean> => {
  try {
    await axiosInstance.get('/api/auth/me');
    return true;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        return false;
      }
      console.error('Network error:', error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    return false;
  }
};
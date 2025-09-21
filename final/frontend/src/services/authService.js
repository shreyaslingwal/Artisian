import api from './api';

export const login = async (phone) => {
  try {
    const response = await api.post('/auth/login', { phone });
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

export const sendOtp = async (phone) => {
  const response = await api.post('/auth/send-otp', { phone });
  return response.data;
};

export const verifyOtp = async (phone, otp) => {
  const response = await api.post('/auth/verify-otp', { phone, otp });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch (e) {
    return null;
  }
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const selectRole = async (role) => {
  try {
    const response = await api.post('/user/select-role', { role }, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error selecting role:', error);
    throw error;
  }
};

import { jwtDecode } from 'jwt-decode';
import api from '../api';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';

interface AuthData {
  username: string;
  password: string;
}

export const authenticateUser = async (data: AuthData, method: string) => {
  if (method === 'register') {
    await api.post('/api/user/register/', data);
  }

  const response = await api.post('/api/token/', data);

  localStorage.setItem(ACCESS_TOKEN, response.data.access);
  localStorage.setItem(REFRESH_TOKEN, response.data.refresh);

  return response.data;
};

export const refreshToken = async () => {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN);

  if (!refreshToken) {
    localStorage.clear();
    return false;
  }

  try {
    const res = await api.post('/api/token/refresh/', {
      refresh: refreshToken,
    });
    if (res.status === 200) {
      localStorage.setItem(ACCESS_TOKEN, res.data.access);
      return true;
    }
  } catch (error) {
    console.log(error);
  }
  localStorage.clear();
  return false;
};

export const verifyAuth = async () => {
  const token = localStorage.getItem(ACCESS_TOKEN);

  if (!token) {
    localStorage.clear();
    return false;
  }
  try {
    const decoded = jwtDecode(token);
    const tokenExpiration = decoded.exp;
    const now = Date.now() / 1000;

    if (!tokenExpiration || tokenExpiration < now) {
      return await refreshToken();
    }

    return true;
  } catch (error) {
    console.log(error);
    localStorage.clear();
    return false;
  }
};

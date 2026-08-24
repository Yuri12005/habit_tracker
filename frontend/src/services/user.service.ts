import api from '../api';

export const fetchUser = async () => {
  const res = await api.get('/api/user/me/');
  return res.data;
};

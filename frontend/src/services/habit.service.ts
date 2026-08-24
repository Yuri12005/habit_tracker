import api from '../api';

interface LogData {
  habit: number;
  completed_at: string;
}

interface PaginationData {
  searchQuery: string;
  page: number;
}

interface HabitData {
  title: string;
  color: string;
}

export const logHabit = async (data: LogData) => {
  const res = await api.post('/api/habit-logs/', data);
  return res.data.id;
};

export const deleteLog = async (logId: number) => {
  await api.delete(`/api/habit-logs/${logId}/`);
  return true;
};

export const fetchHabits = async ({ searchQuery, page }: PaginationData) => {
  const res = await api.get(`/api/habits/?search=${searchQuery}&p=${page}`);
  return res.data;
};

export const removeHabit = async (id: number) => {
  await api.delete(`/api/habits/${id}/`);
  return true;
};

export const createHabit = async ({ title, color }: HabitData) => {
  await api.post('/api/habits/', { title, color });
  return true;
};

export const updateHabit = async ({ title, color }: HabitData, id: number) => {
  await api.put(`/api/habits/${id}/`, { title, color });
  return true;
};

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
  end_date: string | null;
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

export const createHabit = async ({ title, color, end_date }: HabitData) => {
  await api.post('/api/habits/', { title, color, end_date });
  return true;
};

export const updateHabit = async (
  { title, color, end_date }: HabitData,
  id: number
) => {
  await api.put(`/api/habits/${id}/`, { title, color, end_date });
  return true;
};

export const getPendingHabitsCount = async () => {
  const res = await api.get('/api/habits/pending-count/');
  return res.data.count;
};

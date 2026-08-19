import { useState, useEffect, useMemo, ChangeEvent } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import deleteIcon from '../assets/delete.png';
import '../styles/Habits.css';
import { IHabit } from '../types/habit.types';
import { debounce } from '../functions/functions';

interface HabitProps {
  habit: IHabit;
  onDelete: (id: number) => void;
  onUpdate: () => void;
}

function Habit({ habit, onDelete, onUpdate }: HabitProps) {
  const [completedToday, setCompletedToday] = useState(
    habit.today_log_id ? true : false
  );
  const [loading, setLoading] = useState(false);
  const [logId, setLogId] = useState(habit.today_log_id || null);
  const navigate = useNavigate();

  const handleLogHabit = async () => {
    setLoading(true);
    if (!completedToday) {
      const today = new Date().toISOString().split('T')[0];
      try {
        const res = await api.post('/api/habit-logs/', {
          habit: habit.id,
          completed_at: today,
        });
        if (res.status === 201) {
          setCompletedToday(true);
          setLogId(res.data.id);
          onUpdate();
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        alert('Could not log the habit' + errorMessage);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const res = await api.delete(`/api/habit-logs/${logId}/`);
        if (res.status === 204) {
          setCompletedToday(false);
          setLogId(null);
          onUpdate();
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        alert('Could not remove log of the habit' + errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  const goToUpdate = () => {
    navigate(`/edit-habit/${habit.id}`, {
      state: { method: 'Update', habit: habit },
    });
  };

  return (
    <div className="single-habit">
      <button
        className="update-habit-button"
        title="Update habit"
        onClick={goToUpdate}
      >
        ✏️
      </button>
      <p className="habit-title" style={{ color: habit.color }}>
        {habit.title}
      </p>
      <p className="habit-streak" title="Habit streak">
        {habit.current_streak}
      </p>
      <button
        className="habit-log-button"
        title="Log habit"
        onClick={handleLogHabit}
        disabled={loading}
      >
        {completedToday ? '❤️' : '🩶'}
      </button>
      <button
        className="delete-habit-button"
        onClick={() => {
          onDelete(habit.id);
        }}
      >
        <img src={deleteIcon} alt="Delete habit" />
      </button>
    </div>
  );
}

function HabitsList() {
  const [habits, setHabits] = useState<IHabit[]>([]);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const getHabits = async (searchQuery: string = '') => {
    try {
      const res = await api.get(`/api/habits/?search=${searchQuery}`);
      setHabits(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteHabit = async (id: number) => {
    try {
      const res = await api.delete(`/api/habits/${id}/`);
      if (res.status === 204) {
        alert('Habit deleted!');
        setHabits(habits.filter((habit) => habit.id !== id));
      }
    } catch (error) {
      alert('Error occured' + error);
    }
  };

  const goToCreate = () => {
    navigate('/create-habit', { state: { method: 'Create' } });
  };

  const handleSearch = useMemo(
    () =>
      debounce((searchQuery: string) => {
        getHabits(searchQuery);
      }, 500),
    []
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    handleSearch(e.target.value);
  };

  useEffect(() => {
    getHabits('');
  }, []);

  return (
    <div className="habits-container">
      <div className="habits-header-row">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search"
        />
        <h1 className="habits-header">MY HABITS</h1>
        <button className="add-habit-button" onClick={goToCreate}>
          Add New Habit
        </button>
      </div>
      <div className="habits-list">
        {habits.map((habit) => (
          <Habit
            key={habit.id}
            habit={habit}
            onDelete={deleteHabit}
            onUpdate={() => {
              getHabits(query);
            }}
          />
        ))}
      </div>

      {habits.length === 0 && (
        <>
          <p className="no-habits-text">You don't have any habits yet</p>
          <p className="no-habits-text">Let's create your first habit</p>
        </>
      )}
    </div>
  );
}

export default HabitsList;

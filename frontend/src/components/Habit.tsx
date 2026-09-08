import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import deleteIcon from '../assets/delete.png';
import '../styles/Habits.css';
import { IHabit } from '../types/habit.types';
import { logHabit, deleteLog } from '../services/habit.service';

interface HabitProps {
  habit: IHabit;
  onDelete: (id: number) => void;
  onUpdate: () => void;
}

const dateFormatter = new Intl.DateTimeFormat('en-Us', {
  month: 'short',
  day: 'numeric',
});

const parseBackendDate = (dateStr: string) => {
  return new Date(dateStr);
};

const formatDateSafely = (dateStr?: string | null, fallback: string = '-') => {
  if (!dateStr) return fallback;

  try {
    return dateFormatter.format(parseBackendDate(dateStr));
  } catch (error) {
    console.error('Error in formatting date:', dateStr, error);
    return fallback;
  }
};

export default function Habit({ habit, onDelete, onUpdate }: HabitProps) {
  const [completedToday, setCompletedToday] = useState(
    habit.today_log_id ? true : false
  );
  const [loading, setLoading] = useState(false);
  const [logId, setLogId] = useState(habit.today_log_id || null);
  const navigate = useNavigate();

  const formattedCreatedDate = formatDateSafely(habit.created_at, 'No date');
  const formattedEndDate = formatDateSafely(habit.end_date, '-');

  const handleLogHabit = async () => {
    setLoading(true);
    if (!completedToday) {
      const today = new Date().toISOString().split('T')[0];
      try {
        const newLogId = await logHabit({
          habit: habit.id,
          completed_at: today,
        });

        setCompletedToday(true);
        setLogId(newLogId);
        onUpdate();
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        alert('Could not log the habit: ' + errorMessage);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        if (logId !== null) {
          await deleteLog(logId);
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
      <div className="date-container">
        <p className="habit-date">{formattedCreatedDate}</p>
        <p>&mdash;</p>
        <p className="habit-date">{formattedEndDate}</p>
      </div>
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

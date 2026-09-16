import { IHabit } from '../types/habit.types';
import { useState } from 'react';
import { useNotificationStore } from '../store/notificationStore';
import {
  formatDateSafely,
  isDeadlineWithinFiveDays,
} from '../utils/habit-functions';
import { logHabit } from '../services/habit.service';

interface HabitProps {
  habit: IHabit;
  onUpdate: () => void;
}
export default function NotificationHabit({ habit, onUpdate }: HabitProps) {
  const [completedToday, setCompletedToday] = useState(
    habit.today_log_id ? true : false
  );
  const [loading, setLoading] = useState(false);
  const decrement = useNotificationStore((state) => state.decrement);
  const isDeadline = isDeadlineWithinFiveDays(habit.end_date);
  const formattedEndDate = formatDateSafely(habit.end_date, '-');

  const handleLogHabit = async () => {
    setLoading(true);
    if (!completedToday) {
      const today = new Date().toISOString().split('T')[0];
      try {
        await logHabit({
          habit: habit.id,
          completed_at: today,
        });

        setCompletedToday(true);
        if (habit.current_streak > 0 || isDeadline) {
          decrement();
        }
        onUpdate();
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        alert('Could not log the habit: ' + errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="single-habit">
      {formattedEndDate !== '-' && (
        <p className="habit-title">
          <span style={{ color: habit.color }}>
            <b>{habit.title}</b>
          </span>{' '}
          ends on <b>{formattedEndDate}</b>
        </p>
      )}
      {formattedEndDate === '-' && (
        <p className="habit-title">
          Don`t lose your{' '}
          <b>
            {habit.current_streak}
            {habit.current_streak > 1 ? '-days' : '-day'} streak
          </b>{' '}
          for{' '}
          <span style={{ color: habit.color }}>
            <b>{habit.title}</b>
          </span>{' '}
          !
        </p>
      )}
      <button
        className="habit-log-button"
        title="Log habit"
        onClick={handleLogHabit}
        disabled={loading}
      >
        {completedToday ? '❤️' : '🩶'}
      </button>
    </div>
  );
}

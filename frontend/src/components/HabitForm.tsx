import { useState, SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { IHabit } from '../types/habit.types';
import { createHabit, updateHabit } from '../services/habit.service';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/HabitForm.css';

interface HabitFormProps {
  method: string;
  habit?: IHabit;
}

export default function HabitForm({ method, habit }: HabitFormProps) {
  const [title, setTitle] = useState(habit ? habit.title : '');
  const [color, setColor] = useState(habit ? habit.color : 'red');
  const [endDate, setEndDate] = useState<Date | null>(
    habit?.end_date ? new Date(habit.end_date) : null
  );
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const header = method === 'Create' ? 'Create habit' : 'Update habit';

  const addDays = (days: number) => {
    const baseDate = endDate ? new Date(endDate) : new Date();
    baseDate.setDate(baseDate.getDate() + days);
    setEndDate(new Date(baseDate.getTime()));
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    setLoading(true);
    e.preventDefault();

    const formattedEndDate = endDate
      ? endDate.toLocaleDateString('en-CA')
      : null;

    try {
      if (method === 'Create') {
        await createHabit({ title, color, end_date: formattedEndDate });
      } else if (method === 'Update' && habit) {
        await updateHabit(
          { title, color, end_date: formattedEndDate },
          habit.id
        );
      } else {
        throw new Error('Invalid method or missing habit data');
      }

      navigate('/');
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      alert('Error occurred: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-form-container">
      <form className="habit-form" onSubmit={handleSubmit}>
        <h1>{header}</h1>
        <label htmlFor="title-input" className="form-label">
          Title
        </label>
        <input
          id="title-input"
          className="form-input"
          type="text"
          value={title}
          placeholder="Title"
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
        <label htmlFor="colors" className="form-label">
          Color
        </label>
        <select
          className="select-colors"
          id="colors"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        >
          <option value="red">Red</option>
          <option value="blue">Blue</option>
          <option value="magenta">Magenta</option>
          <option value="black">Black</option>
          <option value="orange">Orange</option>
          <option value="darkgreen">Dark green</option>
        </select>
        <label className="form-label">End date (optional)</label>
        <div className="date-form-container">
          <DatePicker
            selected={endDate}
            onChange={(date: Date | null) => setEndDate(date)}
            className="date-picker"
            minDate={new Date()}
            placeholderText="Choose end date"
            dateFormat="dd/MM/yyyy"
            isClearable
          />
          <button
            className="date-button"
            type="button"
            onClick={() => {
              addDays(7);
            }}
          >
            + 1 week
          </button>
          <button
            className="date-button"
            type="button"
            onClick={() => {
              addDays(30);
            }}
          >
            + 30 days
          </button>
          <button
            className="date-button"
            type="button"
            onClick={() => {
              addDays(90);
            }}
          >
            + 90 days
          </button>
        </div>
        <div className="button-form-container">
          <button
            className="create-form-button"
            type="submit"
            disabled={loading}
          >
            {method.toUpperCase()}
          </button>
          <button
            className="return-form-button"
            type="button"
            onClick={() => navigate('/')}
            disabled={loading}
          >
            Return
          </button>
        </div>
      </form>
    </div>
  );
}

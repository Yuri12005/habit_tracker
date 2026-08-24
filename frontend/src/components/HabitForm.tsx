import { useState, SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { IHabit } from '../types/habit.types';
import '../styles/HabitForm.css';
import { createHabit, updateHabit } from '../services/habit.service';

interface HabitFormProps {
  method: string;
  habit?: IHabit;
}

export default function HabitForm({ method, habit }: HabitFormProps) {
  const [title, setTitle] = useState(habit ? habit.title : '');
  const [color, setColor] = useState(habit ? habit.color : 'red');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const header = method === 'Create' ? 'Create habit' : 'Update habit';

  const handleSubmit = async (e: SyntheticEvent) => {
    setLoading(true);
    e.preventDefault();
    try {
      if (method === 'Create') {
        await createHabit({ title, color });
      } else if (method === 'Update' && habit) {
        await updateHabit({ title, color }, habit.id);
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

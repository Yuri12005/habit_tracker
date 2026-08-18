import HabitForm from '../components/HabitForm';
import { useLocation } from 'react-router-dom';

export default function EditHabit() {
  const location = useLocation();
  const { method, habit } = location.state || {};

  return <HabitForm method={method} habit={habit} />;
}

import HabitForm from '../components/HabitForm';
import { useLocation } from 'react-router-dom';

export default function CreateHabit() {
  const location = useLocation();
  const { method } = location.state || {};

  return <HabitForm method={method} />;
}

import User from '../components/User';
import HabitsList from '../components/HabitsList';
import LogoutNav from '../components/Logout';
import Notification from '../components/Notification';
import { getPendingHabitsCount } from '../services/habit.service';
import '../styles/Home.css';
import { useEffect } from 'react';
import { useNotificationStore } from '../store/notificationStore';

function Home() {
  const setCount = useNotificationStore((state) => state.setCount);

  useEffect(() => {
    const getNotificationCount = async () => {
      try {
        const data = await getPendingHabitsCount();
        setCount(data);
      } catch (error) {
        console.error('Could not fetch notification count', error);
      }
    };
    getNotificationCount();
  }, [setCount]);

  return (
    <div className="home-page-container">
      <div className="top-container">
        <User />
        <Notification />
        <LogoutNav />
      </div>
      <HabitsList />
    </div>
  );
}

export default Home;

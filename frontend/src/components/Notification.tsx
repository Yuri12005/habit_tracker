import { useNotificationStore } from '../store/notificationStore';
import { useNavigate } from 'react-router-dom';

export default function Notification() {
  const navigate = useNavigate();
  const count = useNotificationStore((state) => state.count);
  return (
    <button
      type="button"
      className="notification-button"
      onClick={() => {
        console.log('Клік по дзвіночку відбувся!');
        navigate('/notifications');
      }}
    >
      🔔{' '}
      {count > 0 && (
        <span className="count-style">{count < 10 ? count : '9+'}</span>
      )}
    </button>
  );
}

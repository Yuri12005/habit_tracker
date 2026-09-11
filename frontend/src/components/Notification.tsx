import { useNotificationStore } from '../store/notificationStore';
export default function Notification() {
  const count = useNotificationStore((state) => state.count);
  return (
    <button className="notification-button">
      🔔{' '}
      {count > 0 && (
        <span className="count-style">{count < 10 ? count : '9+'}</span>
      )}
    </button>
  );
}

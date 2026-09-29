import { IHabit } from '../types/habit.types';
import '../styles/DeleteModal.css';

interface DeleteModalProps {
  onDelete: (id: number) => void;
  habit: IHabit;
  onClose: () => void;
}

export default function DeleteModal({
  onDelete,
  habit,
  onClose,
}: DeleteModalProps) {
  return (
    <div className="delete-modal-background" onClick={onClose}>
      <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
        <p className="delete-modal-text">
          Are you sure you want to delete{' '}
          <span style={{ color: habit.color }} className="delete-modal-span">
            {habit.title}
          </span>
          ?
        </p>
        <div className="button-form-container">
          <button
            onClick={() => {
              onDelete(habit.id);
              onClose();
            }}
            className="delete-form-button"
          >
            Delete
          </button>
          <button onClick={onClose} className="delete-form-button">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

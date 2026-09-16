import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Habits.css';
import NotificationHabit from './NotificationHabit';
import { IHabit } from '../types/habit.types';
import { fetchNotifications } from '../services/habit.service';

function NotificationList() {
  const [habits, setHabits] = useState<IHabit[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const PAGE_SIZE = 10;
  const navigate = useNavigate();

  const getHabits = async (page: number = 1) => {
    try {
      const data = await fetchNotifications(page);

      setHabits(data.results);

      setTotalPages(Math.ceil(data.count / PAGE_SIZE));
    } catch (error) {
      console.log(error);
    }
  };

  const goToHome = () => {
    navigate('/');
  };

  useEffect(() => {
    getHabits(currentPage);
  }, [currentPage]);

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="home-page-container">
      <div className="habits-container">
        <div className="habits-header-row">
          <h1 className="habits-header">MY NOTIFICATIONS</h1>
          <button className="add-habit-button" onClick={goToHome}>
            Home
          </button>
        </div>
        <div className="habits-list">
          {habits.map((habit) => (
            <NotificationHabit
              key={habit.id}
              habit={habit}
              onUpdate={() => {
                getHabits(currentPage);
              }}
            />
          ))}
        </div>

        {habits.length === 0 && (
          <>
            <p className="no-habits-text">You don't have any notifications</p>
          </>
        )}

        {totalPages > 1 && (
          <div className="pagination-container">
            <button
              className="pagination-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Prev
            </button>
            {pageNumbers.map((number) => (
              <button
                key={number}
                className={`pagination-btn ${currentPage === number ? 'active' : ''}`}
                disabled={currentPage === number}
                onClick={() => setCurrentPage(number)}
              >
                {number}
              </button>
            ))}
            <button
              className="pagination-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationList;

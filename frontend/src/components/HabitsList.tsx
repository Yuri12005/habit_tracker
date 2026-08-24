import { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Habits.css';
import { IHabit } from '../types/habit.types';
import { useDebounce } from '../customHooks/hooks';
import Habit from './Habit';
import { fetchHabits, removeHabit } from '../services/habit.service';

function HabitsList() {
  const [habits, setHabits] = useState<IHabit[]>([]);
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const PAGE_SIZE = 10;
  const debouncedSearch = useDebounce(query);
  const navigate = useNavigate();

  const getHabits = async (searchQuery: string = '', page: number = 1) => {
    try {
      const data = await fetchHabits({ searchQuery, page });

      setHabits(data.results);

      setTotalPages(Math.ceil(data.count / PAGE_SIZE));
    } catch (error) {
      console.log(error);
    }
  };

  const deleteHabit = async (id: number) => {
    try {
      await removeHabit(id);
      alert('Habit deleted!');
      getHabits(debouncedSearch, currentPage);
    } catch (error) {
      alert('Error occured' + error);
    }
  };

  const goToCreate = () => {
    navigate('/create-habit', { state: { method: 'Create' } });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setCurrentPage(1);
  };

  useEffect(() => {
    getHabits(debouncedSearch, currentPage);
  }, [debouncedSearch, currentPage]);

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="habits-container">
      <div className="habits-header-row">
        <input
          className="search-bar"
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search"
        />
        <h1 className="habits-header">MY HABITS</h1>
        <button className="add-habit-button" onClick={goToCreate}>
          Add New Habit
        </button>
      </div>
      <div className="habits-list">
        {habits.map((habit) => (
          <Habit
            key={habit.id}
            habit={habit}
            onDelete={deleteHabit}
            onUpdate={() => {
              getHabits(debouncedSearch, currentPage);
            }}
          />
        ))}
      </div>

      {habits.length === 0 && debouncedSearch === '' && (
        <>
          <p className="no-habits-text">You don't have any habits yet</p>
          <p className="no-habits-text">Let's create your first habit</p>
        </>
      )}

      {habits.length === 0 && debouncedSearch !== '' && (
        <p className="no-habits-text">
          No results found for '{debouncedSearch}'
        </p>
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
  );
}

export default HabitsList;

import { useEffect, useState } from 'react';
import { fetchEvents, createEvent } from '@api/eventService';
import { getUser } from '@api/authService';
import styles from './Events.module.scss';
import EventList from './components/EventList';
import { Link } from 'react-router-dom';
import CreateEventModal from './components/CreateEventModal';
import { User } from '../../types/user';
import { Events as IEvents, Event } from '../../types/event';

const Events = () => {
  const [events, setEvents] = useState<IEvents>();
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const loadEvents = async (page: number = 1) => {
    setLoading(true);
    try {
      const data = await fetchEvents(page);
      setEvents(data);
      setFilteredEvents(data.events);
      setCurrentPage(data.currentPage);
    } catch (error) {
      setError('Ошибка при загрузке мероприятий');
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (eventData: {
    title: string;
    description: string;
    date: string;
    category: string;
  }) => {
    try {
      await createEvent(eventData);
      loadEvents(currentPage);
    } catch (error) {
      console.error('Ошибка при создании мероприятия:', error);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= (events?.totalPages || 1)) {
      loadEvents(page);
    }
  };

  useEffect(() => {
    loadEvents(currentPage);
    getUser()
      .then(setUser)
      .catch((error) => console.error('Ошибка при загрузке пользователя:', error));
  }, []);

  console.log(user)

  const renderPageNumbers = () => {
    if (!events) return null;
    
    const pageNumbers = [];
    const maxPagesToShow = 5; 
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(events.totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`${styles.pageButton} ${currentPage === i ? styles.active : ''}`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className={styles.pagination}>
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className={styles.pageButton}
        >
          &laquo;
        </button>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={styles.pageButton}
        >
          &lsaquo;
        </button>
        
        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className={styles.pageButton}
            >
              1
            </button>
            {startPage > 2 && <span className={styles.pageDots}>...</span>}
          </>
        )}
        
        {pageNumbers}
        
        {endPage < events.totalPages && (
          <>
            {endPage < events.totalPages - 1 && <span className={styles.pageDots}>...</span>}
            <button
              onClick={() => handlePageChange(events.totalPages)}
              className={styles.pageButton}
            >
              {events.totalPages}
            </button>
          </>
        )}
        
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === events.totalPages}
          className={styles.pageButton}
        >
          &rsaquo;
        </button>
        <button
          onClick={() => handlePageChange(events.totalPages)}
          disabled={currentPage === events.totalPages}
          className={styles.pageButton}
        >
          &raquo;
        </button>
      </div>
    );
  };

  return (
    <div className={styles.eventsPage}>
      <div className={styles.backgroundAnimation}></div>
      
      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/2452/2452565.png"
            alt="Логотип"
            className={styles.logo}
          />
          <h1 className={styles.title}>Мои<span>Мероприятия</span></h1>
        </div>

        {user ? (
          <div className={styles.userSection}>
            <div className={styles.userGreeting}>
              <span className={styles.welcome}>Добро пожаловать,</span>
              <span className={styles.userName}>{user.name}</span>
            </div>
          </div>
        ) : (
          <div className={styles.authSection}>
            <div className={styles.authButtons}>
              <Link to="/login" className={styles.authButton}>
                Войти
              </Link>
              <Link to="/register" className={`${styles.authButton} ${styles.registerButton}`}>
                Регистрация
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className={styles.mainContent}>
        <div className={styles.actionsBar}>
          <h2 className={styles.sectionTitle}>Все мероприятия</h2>
          <div className={styles.filterControls}>
            {user && (
              <button 
                onClick={() => setIsModalOpen(true)} 
                className={styles.createButton}
              >
                + Создать мероприятие
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className={styles.loader}>
            <div className={styles.spinner}></div>
            <p>Загрузка мероприятий...</p>
          </div>
        ) : error ? (
          <p className={styles.error}>{error}</p>
        ) : (
          <>
            <EventList 
              events={filteredEvents} 
              onEventUpdate={() => loadEvents(currentPage)} 
              user={user}
            />
            {events && events.totalPages > 1 && renderPageNumbers()}
          </>
        )}
        {isModalOpen && (
          <CreateEventModal
            onClose={() => setIsModalOpen(false)}
            onCreate={handleCreateEvent}
          />
        )}
      </main>
    </div>
  );
};

export default Events;
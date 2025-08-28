import { Link } from 'react-router-dom';
import styles from './NotFound.module.scss';

const NotFound = () => {
  return (
    <div className={styles.notFoundPage}>
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
      </header>

      <main className={styles.mainContent}>
        <div className={styles.errorContainer}>
          <div className={styles.errorIllustration}>
            <img 
              src="https://cdn-icons-png.flaticon.com/512/755/755014.png" 
              alt="Ошибка 404" 
              className={styles.errorImage}
            />
            <div className={styles.errorGlow}></div>
          </div>
          
          <h2 className={styles.errorTitle}>404 - Страница не найдена</h2>
          <p className={styles.errorText}>
            Кажется, мы не можем найти страницу, которую вы ищете.
            Возможно, она была перемещена или удалена.
          </p>
          
          <Link to="/" className={styles.homeButton}>
            Вернуться на главную
          </Link>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
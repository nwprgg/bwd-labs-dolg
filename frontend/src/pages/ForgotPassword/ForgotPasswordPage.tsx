import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './ForgotPassword.module.scss';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Инструкции по восстановлению пароля отправлены на ваш email');
  };

  return (
    <div className={styles.forgotPasswordPage}>
      <div className={styles.contentWrapper}>
        <h1 className={styles.title}>Восстановление пароля</h1>
        
        <div className={styles.funnySection}>
          <img 
            src="https://cdn-icons-png.flaticon.com/512/4426/4426981.png" 
            alt="Замена картинки с ключами"
            className={styles.funnyImage}
          />
          <p className={styles.reminder}>Не забывайте пароль больше</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
              placeholder="Введите ваш email"
            />
          </div>
          
          <button type="submit" className={styles.submitButton}>
            Отправить инструкции
          </button>
          
          {message && <p className={styles.message}>{message}</p>}
          
          <Link to="/login" className={styles.backLink}>
            ← Вернуться к странице входа
          </Link>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
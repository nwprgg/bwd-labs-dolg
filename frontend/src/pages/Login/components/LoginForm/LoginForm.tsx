import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '@api/authService';
import { setToken } from '@utils/storage';
import styles from './LoginForm.module.scss';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const { token } = await login(email, password);
      setToken(token);
      navigate('/events');
    } catch (error) {
      setError('Неверный email или пароль. Пожалуйста, попробуйте снова.');
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.loginForm}>
      <div className={styles.formGroup}>
        <label htmlFor="email" className={styles.label}>Email</label>
        <input
          id="email"
          type="email"
          placeholder="Введите ваш email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
          required
        />
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="password" className={styles.label}>Пароль</label>
        <input
          id="password"
          type="password"
          placeholder="Введите ваш пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
          required
        />
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <button 
        type="submit" 
        className={styles.submitButton}
        disabled={isLoading}
      >
        {isLoading ? 'Вход...' : 'Войти'}
      </button>

      <div className={styles.footerLinks}>
        <Link to="/forgot-password" className={styles.link}>Забыли пароль?</Link>
        <span className={styles.divider}>|</span>
        <Link to="/register" className={styles.link}>Создать аккаунт</Link>
      </div>
    </form>
  );
};

export default LoginForm;
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '@utils/storage';
import { verifyToken } from '@api/authService';
import styles from './Login.module.scss';
import LoginForm from './components/LoginForm/LoginForm';

const Login = () => {
  const navigate = useNavigate();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = getToken();
        if (!token) {
          setIsCheckingAuth(false);
          return;
        }

        const isValid = await verifyToken();
        if (isValid) {
          navigate('/events');
        } else {
          localStorage.removeItem('authToken');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem('authToken');
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (isCheckingAuth) {
    return <div className={styles.loading}>Проверка авторизации...</div>;
  }

  return (
    <div className={styles.loginPage}>
      <div className={styles.backgroundAnimation}></div>
      <div className={styles.loginContainer}>
        <div className={styles.logoSection}>
          <img 
            src="https://cdn-icons-png.flaticon.com/512/2452/2452565.png" 
            alt="Логотип" 
            className={styles.logo}
          />
          <h1 className={styles.title}>Добро пожаловать в <span>МоиМероприятия</span></h1>
          <p className={styles.subtitle}>Войдите, чтобы управлять своими мероприятиями</p>
        </div>
        <div className={styles.formSection}>
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;
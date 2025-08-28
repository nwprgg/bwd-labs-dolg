import styles from './Register.module.scss';
import RegisterForm from './components/RegisterForm';

const Register = () => {
  return (
    <div className={styles.registerPage}>
      <div className={styles.backgroundAnimation}></div>
      <div className={styles.registerContainer}>
        <div className={styles.logoSection}>
          <img 
            src="https://cdn-icons-png.flaticon.com/512/2452/2452565.png" 
            alt="Логотип" 
            className={styles.logo}
          />
          <h1 className={styles.title}>Создайте аккаунт в <span>MyEvents</span></h1>
          <p className={styles.subtitle}>Присоединяйтесь к платформе для управления мероприятиями</p>
        </div>
        <div className={styles.formSection}>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default Register;
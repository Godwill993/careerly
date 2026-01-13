import { useState } from 'react';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import styles from '../styles/Auth.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      await authService.login(email, password);
      navigate('/student-dashboard'); // Default redirect
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className={styles.authContainer}>
      <form className={styles.authCard} onSubmit={handleEmailLogin}>
        <h2>Welcome Back</h2>
        <p>Login to access your dashboard</p>
        
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
        
        <button type="submit" className="btn btn-primary">Login</button>
        
        <div className={styles.divider}>or</div>
        
        <button type="button" onClick={googleLogin} className={styles.googleBtn}>
          <FcGoogle /> Continue with Google
        </button>
        
        <p className={styles.switch}>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
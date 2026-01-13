import { useState } from 'react';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Auth.module.css';

const Register = () => {
  const [formData, setFormData] = useState({ email: '', password: '', role: 'student' });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await authService.register(formData.email, formData.password);
      await userService.createUserProfile(res.user.uid, {
        email: formData.email,
        role: formData.role
      });
      navigate(`/${formData.role}-dashboard`);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className={styles.authContainer}>
      <form className={styles.authCard} onSubmit={handleRegister}>
        <h2>Create Account</h2>
        <input type="email" placeholder="Email" onChange={(e) => setFormData({...formData, email: e.target.value})} required />
        <input type="password" placeholder="Password" onChange={(e) => setFormData({...formData, password: e.target.value})} required />
        
        <select className={styles.select} onChange={(e) => setFormData({...formData, role: e.target.value})}>
          <option value="student">Student</option>
          <option value="school">School</option>
          <option value="company">Company</option>
        </select>
        
        <button type="submit" className="btn btn-primary">Register</button>
      </form>
    </div>
  );
};

export default Register;
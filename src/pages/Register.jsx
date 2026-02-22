import { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import { schoolService } from '../services/schoolService';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Auth.module.css';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
  const navigate = useNavigate();

  const [schools, setSchools] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const loadSchools = async () => {
      const schoolList = await schoolService.getAllSchools();
      setSchools(schoolList);
    };
    loadSchools();
  }, []);

  useEffect(() => {
    const loadDepartments = async () => {
      if (formData.role === 'student' && formData.schoolId) {
        const deps = await schoolService.getDepartments(formData.schoolId);
        setDepartments(deps);
      }
    };
    loadDepartments();
  }, [formData.schoolId, formData.role]);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await authService.register(formData.email, formData.password);
      
      const userData = {
        displayName: formData.name, // generic name field used for student/company/school
        email: formData.email,
        role: formData.role
      };

      if (formData.role === 'student') {
        if (!formData.schoolId || !formData.department) {
           throw new Error("Students must select a school and department");
        }
        userData.schoolId = formData.schoolId;
        userData.department = formData.department;
        userData.courses = []; 
      }

      await userService.createUserProfile(res.user.uid, userData);
      navigate(`/${formData.role}-dashboard`);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className={styles.authContainer}>
      <form className={styles.authCard} onSubmit={handleRegister}>
        <h2>Create Account</h2>
        <input 
          type="text" 
          placeholder={formData.role === 'student' ? "Full Name" : formData.role === 'school' ? "School Name" : "Company Name"} 
          onChange={(e) => setFormData({...formData, name: e.target.value})} 
          required 
        />
        <input type="email" placeholder="Email" onChange={(e) => setFormData({...formData, email: e.target.value})} required />
        <input type="password" placeholder="Password" onChange={(e) => setFormData({...formData, password: e.target.value})} required />
        
        <select className={styles.select} onChange={(e) => setFormData({...formData, role: e.target.value})} style={{ marginBottom: formData.role === 'student' ? '10px' : '20px' }}>
          <option value="student">Student</option>
          <option value="school">School</option>
          <option value="company">Company</option>
        </select>

        {formData.role === 'student' && (
          <>
            <select 
              className={styles.select} 
              style={{ marginBottom: '10px' }}
              onChange={(e) => setFormData({...formData, schoolId: e.target.value})}
              required
            >
              <option value="">Select your School</option>
              {schools.map(school => (
                <option key={school.id} value={school.id}>{school.displayName || school.email || 'Unnamed School'}</option>
              ))}
            </select>
            
            <select 
              className={styles.select} 
              onChange={(e) => setFormData({...formData, department: e.target.value})}
              required
            >
              <option value="">Select your Department</option>
              {departments.map(dep => (
                <option key={dep.id} value={dep.name}>{dep.name}</option>
              ))}
            </select>
          </>
        )}
        
        <button type="submit" className="btn btn-primary">Register</button>
      </form>
    </div>
  );
};

export default Register;
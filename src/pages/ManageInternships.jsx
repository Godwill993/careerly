import { useState, useEffect } from 'react';
import { internshipService } from '../services/internshipService';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/InternshipSystem.module.css';

const ManageInternships = () => {
  const [internships, setInternships] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    loadMyInternships();
  }, []);

  const loadMyInternships = async () => {
    const data = await internshipService.getAllInternships();
    // Filter by companyId if user is a company
    setInternships(data.filter(i => i.companyId === user.uid));
  };

  const handleStatusChange = async (id, newStatus) => {
    await internshipService.updateInternship(id, { status: newStatus });
    loadMyInternships();
  };

  return (
    <div className={styles.container}>
      <h2>Your Postings</h2>
      <div className={styles.list}>
        {internships.map(item => (
          <div key={item.id} className={styles.row}>
            <div>
              <h4>{item.title}</h4>
              <p>{item.applicantsCount || 0} Applicants</p>
            </div>
            <div className={styles.actions}>
              <select 
                value={item.status} 
                onChange={(e) => handleStatusChange(item.id, e.target.value)}
              >
                <option value="active">Active</option>
                <option value="closed">Closed</option>
                <option value="draft">Draft</option>
              </select>
              <button onClick={() => internshipService.deleteInternship(item.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
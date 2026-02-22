import { useState, useEffect } from 'react';
import { internshipService } from '../services/internshipService';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { db } from '../firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import styles from '../styles/InternshipSystem.module.css';

const ManageInternships = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingApplicantsFor, setViewingApplicantsFor] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.uid) {
      loadMyInternships();
    }
  }, [user]);

  const loadMyInternships = async () => {
    setLoading(true);
    try {
      const data = await internshipService.getCompanyInternships(user.uid);
      setInternships(data);
    } catch (error) {
      console.error("Error loading internships:", error);
    }
    setLoading(false);
  };

  const handleStatusChange = async (id, newStatus) => {
    await internshipService.updateInternship(id, { status: newStatus });
    loadMyInternships();
  };

  const handleViewApplicants = async (internshipId) => {
    setViewingApplicantsFor(internshipId);
    setLoadingApplicants(true);
    try {
      // Create a function in internshipService or query here.
      // Easiest is to query 'applications' where internshipId == ...
      const q = query(collection(db, "applications"), where("internshipId", "==", internshipId));
      const snap = await getDocs(q);
      setApplicants(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error(err);
    }
    setLoadingApplicants(false);
  };

  if (viewingApplicantsFor) {
    return (
      <div className={styles.container}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>Applicants</h2>
          <button className="btn btn-secondary" onClick={() => setViewingApplicantsFor(null)}>Back to Postings</button>
        </div>
        {loadingApplicants ? (
          <LoadingSpinner message="Fetching applicants..." />
        ) : applicants.length === 0 ? (
          <p>No one has applied to this position yet.</p>
        ) : (
          <div className={styles.list}>
            {applicants.map(app => (
              <div key={app.id} className={styles.row}>
                <div>
                  <h4>{app.studentName}</h4>
                  <p>{app.studentEmail}</p>
                </div>
                <div>
                  <span className={styles.badge}>{app.status || 'Pending'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2>Your Postings</h2>
      {loading ? (
        <LoadingSpinner message="Loading your postings..." />
      ) : internships.length === 0 ? (
        <p>You have not posted any internships yet.</p>
      ) : (
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
                style={{ marginRight: '10px', padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }}
              >
                <option value="active">Active</option>
                <option value="closed">Closed</option>
                <option value="draft">Draft</option>
              </select>
              <button className="btn btn-primary" style={{ marginRight: '10px' }} onClick={() => handleViewApplicants(item.id)}>View Applicants</button>
              <button className="btn btn-secondary" onClick={() => internshipService.deleteInternship(item.id).then(loadMyInternships)}>Delete</button>
            </div>
          </div>
        ))}
        </div>
      )}
    </div>
  );
};

export default ManageInternships;
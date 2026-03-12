import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase/config';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { FaCheck, FaTimes, FaSpinner, FaFileSignature } from 'react-icons/fa';
import styles from '../styles/MentorDashboard.module.css';

const MentorDashboard = ({ mentorId }) => {
  const [pendingLogs, setPendingLogs] = useState([]);
  const [validating, setValidating] = useState(null);

  useEffect(() => {
    if (!mentorId) return;

    const q = query(
      collection(db, 'logs'), 
      where('mentorId', '==', mentorId),
      where('status', '==', 'pending')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPendingLogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      console.error("Firestore Listen Error:", error);
    });

    return () => unsubscribe();
  }, [mentorId]);

  const handleValidate = async (logId, isApproved) => {
    setValidating(logId);
    try {
      await updateDoc(doc(db, 'logs', logId), { 
        status: isApproved ? 'validated' : 'rejected',
        validatedAt: new Date(),
      });
    } catch (error) {
      console.error("Error validating log:", error);
    }
    setValidating(null);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Task Validations</h1>
          <p className="text-muted">Instantly verify incoming logs from students.</p>
        </div>
        <div className={styles.pendingBadge}>
          {pendingLogs.length} Pending
        </div>
      </header>
      
      <div className={styles.grid}>
        <AnimatePresence>
          {pendingLogs.length === 0 ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className={styles.emptyState}
            >
              <FaFileSignature className={styles.emptyIcon} />
              <h3>All caught up!</h3>
              <p>No pending student logs require your validation right now.</p>
            </motion.div>
          ) : (
            pendingLogs.map(log => (
              <motion.div 
                key={log.id} 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                className={styles.logCard}
              >
                <div className={styles.logHeader}>
                  <h4>{log.studentName || 'Student Log'}</h4>
                  <span className={styles.timestamp}>
                    {log.timestamp?.toDate ? log.timestamp.toDate().toLocaleDateString() : 'Recent'}
                  </span>
                </div>
                
                <p className={styles.taskDescription}>{log.taskDescription}</p>
                
                {log.skillsGap && log.skillsGap.length > 0 && (
                  <div className={styles.aiGaps}>
                    <span className={styles.aiTag}>AI Flagged Gaps:</span>
                    {log.skillsGap.map(gap => <span key={gap} className={styles.chip}>{gap}</span>)}
                  </div>
                )}
                
                <div className={styles.actions}>
                  <button 
                    onClick={() => handleValidate(log.id, false)} 
                    className={styles.btnReject}
                    disabled={validating === log.id}
                  >
                    {validating === log.id ? <FaSpinner className="fa-spin" /> : <><FaTimes /> Reject</>}
                  </button>
                  <button 
                    onClick={() => handleValidate(log.id, true)} 
                    className={styles.btnValidate}
                    disabled={validating === log.id}
                  >
                    {validating === log.id ? <FaSpinner className="fa-spin" /> : <><FaCheck /> Approve</>}
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MentorDashboard;

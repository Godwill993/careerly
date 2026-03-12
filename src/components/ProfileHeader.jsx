import { useAuth } from '../context/AuthContext';
import { User } from 'lucide-react';
import styles from '../styles/ProfileHeader.module.css';

const ProfileHeader = ({ 
  customUser, 
  stats = [], 
  roleLabel, 
  bannerGradient = 'linear-gradient(135deg, #a8c0ff 0%, #3f2b96 100%)' 
}) => {
  const { user } = useAuth();
  
  const displayUser = customUser || user;
  
  // Choose arc color based on role
  const roleColor = displayUser?.role === 'student' ? '#3b82f6' : displayUser?.role === 'school' ? '#f59e0b' : '#10b981';

  return (
    <div className={styles.container}>
       {/* Banner */}
       <div className={styles.banner} style={{ background: bannerGradient }}></div>
       
       {/* Main Info */}
       <div className={styles.infoRow}>
          <div className={styles.avatarWrapper}>
             <div className={styles.avatarArc} style={{ '--arc-color': roleColor }}></div>
             <div className={styles.avatarInner}>
                {displayUser?.photoURL ? (
                  <img src={displayUser.photoURL} alt={`${displayUser.displayName || 'User'}'s profile`} />
                ) : (
                  <User size={48} color="var(--color-text-muted)" />
                )}
             </div>
          </div>
          
          <div className={styles.profileText}>
             <h2>
               {displayUser?.displayName || displayUser?.name || displayUser?.email?.split('@')[0] || 'User'} 
               <span className={styles.roleBadge} style={{ backgroundColor: roleColor }}>
                 {roleLabel || displayUser?.role || 'Guest'}
               </span>
             </h2>
             <p className={styles.subtitle}>
               {displayUser?.department || displayUser?.companyName || displayUser?.school || 'Member of Careerly'}
             </p>
             <div className={styles.actions}>
                <button className={styles.btnPrimary}>Connect</button>
                <button className={styles.btnSecondary}>Send Message</button>
             </div>
          </div>
          
          <div className={styles.stats}>
             {stats.map((stat, i) => (
                <div key={i} className={styles.statItem}>
                   <h4>{stat.value}</h4>
                   <p>{stat.label}</p>
                </div>
             ))}
          </div>
       </div>
    </div>
  );
};

export default ProfileHeader;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Bell, 
  Lock, 
  Shield, 
  Eye, 
  Database, 
  Smartphone,
  Check,
  ChevronRight,
  LogOut,
  Mail,
  UserCheck,
  Moon,
  Sun,
  Trash2,
  Download
} from 'lucide-react';

import { useTheme } from '../context/ThemeContext';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);
  
  // Use global theme context instead of local state
  const { theme, toggleTheme } = useTheme();

  // Effect to apply theme class to body so it affects the whole platform
  useEffect(() => {
    // This effect is now handled globally in ThemeProvider, but we can keep it if specific class needed
    // or remove it as ThemeProvider likely handles attribute setting.
    // Assuming ThemeProvider handles 'data-theme'.
  }, [theme]);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  
  const menuItems = [
    { id: 'profile', label: 'Profile Information', icon: <User size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'security', label: 'Security & Password', icon: <Lock size={18} /> },
    { id: 'privacy', label: 'Data & Privacy', icon: <Shield size={18} /> },
  ];

  return (
    <div className={`settings-wrapper ${theme}`}>
      <style>{`
        .settings-wrapper {
          min-height: 100vh;
          background-color: var(--bg-main);
          color: var(--text-main);
          padding: 40px 24px;
          font-family: 'Inter', system-ui, sans-serif;
          transition: background-color 0.3s ease, color 0.3s ease;
        }

        .settings-container {
          max-width: 1000px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 32px;
        }

        .settings-sidebar {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          padding: 12px;
          height: fit-content;
        }

        .menu-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 12px;
          border: none;
          background: transparent;
          color: var(--text-muted);
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-bottom: 4px;
        }

        .menu-btn.active {
          background: rgba(37, 99, 235, 0.1);
          color: var(--accent-blue);
        }

        .settings-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 24px;
          padding: 32px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .section-header {
          margin-bottom: 32px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--border-color);
        }

        .section-header h2 { font-size: 24px; font-weight: 800; }
        .section-header p { color: var(--text-muted); font-size: 14px; margin-top: 4px; }

        .input-group { margin-bottom: 24px; }
        .input-group label { 
          display: block; 
          font-size: 14px; 
          font-weight: 700; 
          color: var(--text-main); 
          margin-bottom: 8px; 
        }

        .input-field {
          width: 100%;
          padding: 12px 16px;
          border-radius: 12px;
          border: 1px solid var(--border-color);
          background: var(--bg-main);
          color: var(--text-main);
          font-size: 14px;
          transition: border-color 0.2s;
        }

        .input-field:focus {
          outline: none;
          border-color: var(--accent-blue);
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
        }

        .toggle-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 0;
          border-bottom: 1px solid var(--border-color);
        }

        .toggle-info h4 { font-size: 15px; font-weight: 700; }
        .toggle-info p { font-size: 13px; color: var(--text-muted); }

        .theme-toggle-box {
          display: flex;
          background: var(--bg-main);
          padding: 4px;
          border-radius: 12px;
          gap: 4px;
          width: fit-content;
        }

        .theme-btn {
          padding: 8px 12px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 600;
          background: transparent;
          color: var(--text-muted);
          transition: all 0.2s;
        }

        .theme-btn.active {
          background: var(--bg-card);
          color: var(--accent-blue);
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .save-btn {
          background: var(--accent-blue);
          color: white;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 700;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: opacity 0.2s;
        }

        .save-btn:hover { opacity: 0.9; }
        .save-btn.success { background: #10b981; }

        .danger-zone {
          margin-top: 40px;
          padding: 24px;
          border-radius: 16px;
          border: 1px solid #fee2e2;
          background: #fef2f2;
        }
        .dark .danger-zone { background: rgba(239, 68, 68, 0.1); border-color: #7f1d1d; }

        @media (max-width: 800px) {
          .settings-wrapper { padding: 20px 16px; }
          .settings-container { grid-template-columns: 1fr; }
          .settings-sidebar { margin-bottom: 24px; }
          .settings-card { padding: 20px; }
          .section-header h2 { font-size: 20px; }
          
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <div className="settings-container">
        <aside className="settings-sidebar">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`menu-btn ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
          <div style={{ margin: '12px 0', borderTop: '1px solid var(--border-color)' }} />
          <button className="menu-btn" style={{ color: '#ef4444' }}>
            <LogOut size={18} />
            Sign Out
          </button>
        </aside>

        <main>
          {activeTab === 'profile' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="settings-card">
              <div className="section-header">
                <h2>Profile Information</h2>
                <p>Update your personal details and how employers see you.</p>
              </div>

              <div className="input-group">
                <label>Interface Theme</label>
                <div className="theme-toggle-box">
                  <button 
                    className={`theme-btn ${theme === 'light' ? 'active' : ''}`} 
                    onClick={() => theme === 'dark' && toggleTheme()}
                  >
                    <Sun size={16} /> Light
                  </button>
                  <button 
                    className={`theme-btn ${theme === 'dark' ? 'active' : ''}`} 
                    onClick={() => theme === 'light' && toggleTheme()}
                  >
                    <Moon size={16} /> Dark
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={32} color="var(--text-muted)" />
                </div>
                <button className="save-btn" style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '8px 16px', fontSize: '13px' }}>
                  Change Avatar
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="input-group">
                  <label>Full Name</label>
                  <input className="input-field" defaultValue="Alex Rivera" />
                </div>
                <div className="input-group">
                  <label>Email Address</label>
                  <input className="input-field" defaultValue="alex.rivera@stanford.edu" />
                </div>
              </div>

              <button className={`save-btn ${saved ? 'success' : ''}`} onClick={handleSave}>
                {saved ? <><Check size={18} /> Changes Saved</> : 'Save Profile'}
              </button>
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="settings-card">
              <div className="section-header">
                <h2>Notifications</h2>
                <p>Choose how and when you want to be contacted.</p>
              </div>
              <div className="toggle-row">
                <div className="toggle-info">
                  <h4>Application Updates</h4>
                  <p>Get notified when a company views or responds to your application.</p>
                </div>
                <input type="checkbox" defaultChecked />
              </div>
              <div className="toggle-row">
                <div className="toggle-info">
                  <h4>New Internship Alerts</h4>
                  <p>Daily summaries of jobs matching your profile score.</p>
                </div>
                <input type="checkbox" defaultChecked />
              </div>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="settings-card">
              <div className="section-header">
                <h2>Security</h2>
                <p>Manage your password and account authentication.</p>
              </div>
              <div className="input-group">
                <label>Current Password</label>
                <input className="input-field" type="password" placeholder="••••••••" />
              </div>
              <div style={{ marginTop: '32px', padding: '20px', background: 'var(--color-surface)', borderRadius: '16px', border: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <Smartphone size={20} color="var(--accent-blue)" />
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: '800' }}>Two-Factor Authentication</h4>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>Add an extra layer of security to your account.</p>
                    <button style={{ marginTop: '12px', background: 'transparent', border: 'none', color: 'var(--accent-blue)', fontWeight: '700', cursor: 'pointer', padding: 0 }}>
                      Enable 2FA
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'privacy' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="settings-card">
              <div className="section-header">
                <h2>Data & Privacy</h2>
                <p>Manage your data visibility and account deletion.</p>
              </div>
              
              <div className="toggle-row">
                <div className="toggle-info">
                  <h4>Public Profile</h4>
                  <p>Allow employers to find your profile via search.</p>
                </div>
                <input type="checkbox" defaultChecked />
              </div>

              <div style={{ marginTop: '24px' }}>
                <button className="theme-btn" style={{ padding: '12px', border: '1px solid var(--border-color)', width: '100%', justifyContent: 'center' }}>
                  <Download size={18} /> Export Personal Data (.json)
                </button>
              </div>

              <div className="danger-zone">
                <h4 style={{ color: '#ef4444', fontWeight: '800', fontSize: '15px' }}>Danger Zone</h4>
                <p style={{ fontSize: '13px', color: '#7f1d1d', marginTop: '4px' }}>Once you delete your account, there is no going back. Please be certain.</p>
                <button style={{ marginTop: '16px', background: '#ef4444', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Trash2 size={16} /> Delete Account
                </button>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Settings;
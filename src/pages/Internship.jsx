import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { internshipService } from "../services/internshipService";
import LoadingSpinner from "../components/LoadingSpinner";

import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Clock,
  DollarSign,
  Filter,
  ChevronRight,
  Bookmark,
  Briefcase,
  Building,
  Calendar,
  CheckCircle2,
  Trophy,
  ArrowUpRight,
  X,
} from "lucide-react";

const Internships = () => {
  const [internships, setInternships] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadInternships();
  }, []);

  const loadInternships = async () => {
    setLoading(true);
    try {
      const data = await internshipService.getAllInternships();
      setInternships(data);
      if (data.length > 0) setSelectedId(data[0].id);
    } catch (error) {
      console.error("Error loading internships:", error);
    }
    setLoading(false);
  };

  const handleApply = async () => {
    if (!user) {
      alert("Please log in to apply");
      return;
    }
    if (!selectedId) return;

    setApplying(true);
    try {
      await internshipService.applyToInternship(user.uid, selectedId, {
        studentName: user.displayName || user.email || "Student",
        studentEmail: user.email,
        companyId: selectedJob?.companyId,
        internshipTitle: selectedJob?.title,
      });
      alert("Application submitted successfully!");
    } catch (error) {
      console.error("Failed to apply:", error);
      alert("Failed to submit application. Please make sure you are registered as a Student.");
    }
    setApplying(false);
  };

  const filteredJobs = internships.filter(job => 
    job.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    job.company?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedJob = internships.find((job) => job.id === selectedId);

  return (
    <div className="intern-wrapper">
      <style>{`
        .intern-wrapper {
          background-color: var(--color-bg);
          min-height: 100vh;
          font-family: 'Inter', system-ui, sans-serif;
          color: var(--color-text);
        }

        .top-bar {
          background: var(--color-surface);
          border-bottom: 1px solid var(--color-border);
          padding: 16px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .search-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 24px;
        }

        .search-bar-wrap {
          background: var(--color-surface);
          padding: 8px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05);
          border: 1px solid var(--color-border);
        }

        .search-input {
          flex: 1;
          border: none;
          padding: 12px;
          font-size: 16px;
          outline: none;
          background: transparent;
          color: var(--color-text);
        }

        .filter-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: var(--color-bg);
          border-radius: 12px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          color: var(--color-text);
        }

        .job-card {
          background: var(--color-surface);
          padding: 24px;
          border-radius: 20px;
          border: 2px solid transparent;
          cursor: pointer;
          transition: all 0.2s;
        }

        .job-card.active {
          border-color: var(--color-primary);
          background: var(--color-primary-light);
        }

        .company-logo-placeholder {
          width: 48px;
          height: 48px;
          background: var(--color-border);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-text-muted);
        }

        .company-name { color: var(--color-primary); font-weight: 700; font-size: 14px; }

        .meta-row {
          display: flex;
          gap: 16px;
          color: var(--color-text-muted);
          font-size: 13px;
          margin-top: 12px;
        }

        .detail-view {
          background: var(--color-surface);
          border-radius: 24px;
          border: 1px solid var(--color-border);
          padding: 40px;
          position: sticky;
          top: 100px;
          height: fit-content;
        }

        .apply-btn {
          background: var(--color-primary);
          color: white;
          padding: 14px 32px;
          border-radius: 14px;
          font-weight: 800;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .tag {
          padding: 4px 12px;
          background: var(--color-bg);
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          color: var(--color-text-muted);
        }

        .section-label {
          font-weight: 800;
          text-transform: uppercase;
          font-size: 12px;
          letter-spacing: 0.05em;
          color: var(--color-text-muted);
          margin: 32px 0 16px;
          display: block;
        }

        .main-content {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 400px 1fr;
          gap: 24px;
          padding-bottom: 80px;
        }

        .feed-column {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .req-list {
          list-style: none;
          padding: 0;
        }

        .req-item {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
          font-weight: 500;
        }

        .job-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }

        @media (max-width: 900px) {
          .main-content { grid-template-columns: 1fr; }
          .detail-view { 
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: 1000;
            border-radius: 0;
            overflow-y: auto;
            display: none; /* Controlled by state or logic */
          }
          
          .detail-view.mobile-active {
            display: block;
          }

          .close-detail {
            display: block;
            position: absolute;
            top: 20px;
            right: 20px;
            background: var(--color-surface);
            border-radius: 50%;
            padding: 8px;
            cursor: pointer;
            box-shadow: var(--shadow-md);
          }
          
          .search-bar-wrap {
            flex-direction: column;
            gap: 16px;
            padding: 16px;
          }
          
          .search-input {
            width: 100%;
          }
          
          .filter-btn {
            width: 100%;
            justify-content: center;
          }
          
          .top-bar {
            padding: 16px;
          }
          
          .search-container {
            padding: 20px 16px;
          }
        }

        .close-detail { display: none; }
      `}</style>

      <div className="search-container">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="search-bar-wrap"
        >
          <Search
            className="text-muted"
            size={20}
            style={{ marginLeft: "12px" }}
          />
          <input
            className="search-input"
            placeholder="Search roles, companies, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="filter-btn">
            <Filter size={18} /> Filters
          </button>
        </motion.div>
      </div>

      {/* JOB FEED */}
      <main className="main-content">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="feed-column"
        >
          {loading ? (
            <LoadingSpinner message="Loading awesome opportunities..." fullHeight />
          ) : filteredJobs.length === 0 ? (
            <p style={{ padding: '20px', textAlign: 'center' }}>No internships found.</p>
          ) : (
            filteredJobs.map((job) => (
            <motion.div
              key={job.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`job-card ${selectedId === job.id ? "active" : ""}`}
              onClick={() => setSelectedId(job.id)}
            >
              <div className="job-card-header">
                <div>
                  <h3 className="job-title">{job.title}</h3>
                  <p className="company-name">{job.company}</p>
                </div>
                <div className="company-logo-placeholder">
                  <Building size={24} />
                </div>
              </div>
              <div className="meta-row">
                <div className="meta-item">
                  <MapPin size={14} /> {job.location}
                </div>
                <div className="meta-item">
                  <Clock size={14} /> {job.duration}
                </div>
              </div>
              <div className="meta-row">
                <div
                  className="meta-item"
                  style={{ color: "var(--brand-blue)", fontWeight: "bold" }}
                >
                  <DollarSign size={14} /> {job.stipend}
                </div>
                <div className="meta-item">{job.posted}</div>
              </div>
            </motion.div>
            ))
          )}
        </motion.div>

        {/* DETAIL VIEW */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedId}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className={`detail-view ${selectedId ? 'mobile-active' : ''}`}
          >
            <div className="close-detail" onClick={() => setSelectedId(null)}>
              <X size={24} />
            </div>
            <div className="detail-header">
              <div>
                <div
                  className="tag"
                  style={{
                    background: "#dcfce7",
                    color: "#16a34a",
                    display: "inline-block",
                    marginBottom: "12px",
                  }}
                >
                  Verified Internship
                </div>
                <h1
                  style={{
                    fontSize: "32px",
                    fontWeight: "900",
                    marginBottom: "8px",
                  }}
                >
                  {selectedJob.title}
                </h1>
                <p
                  style={{
                    fontSize: "18px",
                    fontWeight: "700",
                    color: "var(--brand-blue)",
                  }}
                >
                  {selectedJob.company}
                </p>
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <button className="filter-btn" style={{ padding: "14px" }}>
                  <Bookmark size={20} />
                </button>
                <button 
                  className="apply-btn" 
                  onClick={handleApply}
                  disabled={applying}
                  style={{ opacity: applying ? 0.7 : 1 }}
                >
                  {applying ? "Submitting..." : (
                    <>Apply Now <ArrowUpRight size={20} /></>
                  )}
                </button>
              </div>
            </div>

            <div className="tag-row">
              {selectedJob?.tags ? selectedJob.tags.map((tag) => (
                <span key={tag} className="tag">
                  #{tag}
                </span>
              )) : null}
            </div>

            <span className="section-label">Role Overview</span>
            <p
              style={{
                lineHeight: "1.7",
                color: "var(--text-muted)",
                fontSize: "16px",
              }}
            >
              {selectedJob?.description}
            </p>

            <span className="section-label">Key Requirements</span>
            <ul className="req-list">
              {selectedJob?.requirements ? selectedJob.requirements.map((req, i) => (
                <li key={i} className="req-item">
                  <CheckCircle2
                    size={18}
                    style={{ color: "var(--brand-blue)" }}
                  />
                  {req}
                </li>
              )) : (
                <p>No specific requirements provided.</p>
              )}
            </ul>

            <div
              style={{
                marginTop: "40px",
                padding: "24px",
                background: "var(--bg-slate)",
                borderRadius: "20px",
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                textAlign: "center",
              }}
            >
              <div>
                <p className="section-label" style={{ margin: "0 0 4px 0" }}>
                  Duration
                </p>
                <p style={{ fontWeight: "800" }}>{selectedJob.duration}</p>
              </div>
              <div>
                <p className="section-label" style={{ margin: "0 0 4px 0" }}>
                  Stipend
                </p>
                <p style={{ fontWeight: "800" }}>{selectedJob.stipend}</p>
              </div>
              <div>
                <p className="section-label" style={{ margin: "0 0 4px 0" }}>
                  Commitment
                </p>
                <p style={{ fontWeight: "800" }}>{selectedJob.type}</p>
              </div>
            </div>

            <div
              style={{
                marginTop: "40px",
                display: "flex",
                alignItems: "center",
                gap: "16px",
                padding: "16px",
                border: "1px solid var(--border-slate)",
                borderRadius: "16px",
              }}
            >
              <Trophy style={{ color: "#eab308" }} />
              <div>
                <p style={{ fontWeight: "800", fontSize: "14px" }}>
                  BlueGold Premium Benefit
                </p>
                <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  Apply through us to receive priority review and a guaranteed
                  response within 72 hours.
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export default Internships;

import React, { useState, useEffect } from 'react';
import { Plus, Users, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    shortlisted: 0,
    rejected: 0,
    pending: 0
  });

  useEffect(() => {
    fetchJobs();
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/stats');
      setStats(res.data);
    } catch (err) {
      console.error("Stats fetch error:", err);
    }
  };

  const fetchJobs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/jobs');
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Recruiter Dashboard</h1>
        <Link to="/recruiter/create-job" className="btn-primary">
          <Plus size={18} /> New Job Post
        </Link>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginTop: '2rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <Users size={24} color="#6366f1" />
          <h2 style={{ fontSize: '2rem' }}>{stats.total}</h2>
          <p>Total Applicants</p>
        </div>
        <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <CheckCircle size={24} color="#10b981" />
          <h2 style={{ fontSize: '2rem' }}>{stats.shortlisted}</h2>
          <p>Shortlisted</p>
        </div>
        <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <XCircle size={24} color="#ef4444" />
          <h2 style={{ fontSize: '2rem' }}>{stats.rejected}</h2>
          <p>Rejected</p>
        </div>
        <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <Clock size={24} color="#f59e0b" />
          <h2 style={{ fontSize: '2rem' }}>{stats.pending}</h2>
          <p>Pending Interviews</p>
        </div>
      </div>

      <h2 style={{ marginTop: '3rem', marginBottom: '1rem' }}>Active Job Postings</h2>
      <div className="grid">
        {jobs.length > 0 ? jobs.map(job => (
          <div key={job._id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3>{job.title}</h3>
              <p>{job.skills.join(', ')} • {job.experience}</p>
              <small style={{ color: 'var(--text-muted)' }}>Posted on: {new Date(job.createdAt).toLocaleDateString()}</small>
            </div>
            <Link to={`/recruiter/job/${job._id}`} className="btn-primary" style={{ background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)' }}>
              View Applicants
            </Link>
          </div>
        )) : (
          <p>No jobs posted yet. Click "New Job Post" to start.</p>
        )}
      </div>
    </div>
  );
};

export default RecruiterDashboard;

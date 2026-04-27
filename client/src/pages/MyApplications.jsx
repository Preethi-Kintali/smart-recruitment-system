import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Clock, CheckCircle, XCircle, AlertCircle, Info, ChevronRight } from 'lucide-react';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/applications/my-applications', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setApplications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'Applied': return { icon: <Clock size={16} />, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' };
      case 'Shortlisted': return { icon: <CheckCircle size={16} />, color: '#6366f1', bg: 'rgba(99, 102, 241, 0.1)' };
      case 'Interview': return { icon: <Info size={16} />, color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' };
      case 'Hired': return { icon: <CheckCircle size={16} />, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' };
      case 'Rejected': return { icon: <XCircle size={16} />, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' };
      default: return { icon: <AlertCircle size={16} />, color: 'var(--text-muted)', bg: 'rgba(255,255,255,0.05)' };
    }
  };

  if (loading) return <div className="container">Loading...</div>;

  return (
    <div className="container animate-fade-in">
      <div style={{ marginBottom: '3rem' }}>
        <h1>My Applications</h1>
        <p style={{ color: 'var(--text-muted)' }}>Track your hiring status and AI feedback</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {applications.length > 0 ? applications.map(app => {
          const s = getStatusInfo(app.status);
          return (
            <div key={app._id} className="glass-card" style={{ padding: '2rem' }}>
              <div className="grid" style={{ gridTemplateColumns: '1fr auto', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    <h3 style={{ margin: 0 }}>{app.jobId?.title || 'Unknown Role'}</h3>
                    <span style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.4rem', 
                      fontSize: '0.8rem', 
                      padding: '0.3rem 0.8rem', 
                      borderRadius: '20px',
                      background: s.bg,
                      color: s.color
                    }}>
                      {s.icon} {app.status}
                    </span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Applied on: {new Date(app.createdAt).toLocaleDateString()}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent)' }}>{app.atsScore}%</div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>ATS Score</p>
                </div>
              </div>

              <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertCircle size={16} style={{ color: 'var(--accent)' }} /> AI Analysis Feedback
                </h4>
                <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                  <div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Skill Gap Analysis</p>
                    <p style={{ fontSize: '0.9rem', margin: 0 }}>{app.aiFeedback?.gapAnalysis || 'Perfect match for core requirements.'}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Suggestions</p>
                    <p style={{ fontSize: '0.9rem', margin: 0 }}>{app.aiFeedback?.suggestions || 'Keep your profile updated with latest projects.'}</p>
                  </div>
                </div>
              </div>

              {app.status === 'Interview' && (
                <div style={{ marginTop: '1.5rem', border: '1px solid var(--accent)', padding: '1rem', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.05)' }}>
                  <p style={{ margin: 0, fontWeight: 'bold' }}>AI Mock Interview is Ready!</p>
                  <p style={{ margin: '0.5rem 0 1rem', fontSize: '0.9rem' }}>You have been invited to a mock interview. Our AI will speak with you to evaluate your skills.</p>
                  <Link to={`/mock-interview/${app._id}`} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.5rem', textDecoration: 'none' }}>
                    Start Mock Interview <ChevronRight size={16} />
                  </Link>
                </div>
              )}
              {app.status === 'OfflineInterview' && (
                <div style={{ marginTop: '1.5rem', border: '1px solid #10b981', padding: '1rem', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.05)' }}>
                  <p style={{ margin: 0, fontWeight: 'bold', color: '#10b981' }}>In-Person Interview Scheduled!</p>
                  <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem' }}>Check your email for the venue and time details. Good luck!</p>
                </div>
              )}
            </div>
          );
        }) : (
          <div className="glass-card" style={{ textAlign: 'center', padding: '4rem' }}>
            <p style={{ color: 'var(--text-muted)' }}>You haven't applied to any jobs yet.</p>
            <Link to="/jobs" className="btn-primary" style={{ display: 'inline-block', marginTop: '1rem', textDecoration: 'none' }}>Browse Jobs</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;

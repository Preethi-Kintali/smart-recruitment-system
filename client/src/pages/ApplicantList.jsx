import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Clock, AlertTriangle, MessageSquare, Mail, Users, CheckCircle, XCircle, FileText } from 'lucide-react';
import axios from 'axios';

const ApplicantList = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [jobId]);

  const fetchData = async () => {
    try {
      const [jobRes, appRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/jobs`),
        axios.get(`http://localhost:5000/api/applications/job/${jobId}`)
      ]);
      
      const jobs = Array.isArray(jobRes.data) ? jobRes.data : [];
      const currentJob = jobs.find(j => j._id === jobId);
      setJob(currentJob);
      
      const apps = Array.isArray(appRes.data) ? appRes.data : [];
      setApplications(apps);
    } catch (err) {
      console.error("Fetch Data Error:", err);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (appId, status, extra = {}) => {
    try {
      await axios.put(`http://localhost:5000/api/applications/${appId}/status`, { status, ...extra });
      fetchData();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 'Best Fit': return '#10b981';
      case 'Average Fit': return '#f59e0b';
      case 'Low Fit': return '#ef4444';
      default: return 'var(--text-muted)';
    }
  };

  return (
    <div className="container animate-fade-in">
      <Link to="/recruiter" className="flex" style={{ color: 'var(--text-muted)', marginBottom: '1rem', textDecoration: 'none' }}>
        <ArrowLeft size={18} /> Back to Dashboard
      </Link>
      
      {job && (
        <div style={{ marginBottom: '2rem' }}>
          <h1>Applicants for {job.title}</h1>
          <p>{job.skills.join(' • ')}</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {applications.length > 0 ? applications.map(app => (
          <div key={app._id} className="glass-card" style={{ padding: '2rem' }}>
            <div className="grid" style={{ gridTemplateColumns: '1fr auto', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{app.candidateId?.fullName || 'Unknown Candidate'}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Mail size={16} /> {app.candidateId?.email}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Clock size={16} /> {app.candidateId?.experience || '0'} exp</span>
                  <span style={{ padding: '0.2rem 0.8rem', borderRadius: '20px', background: 'rgba(255,255,255,0.05)', color: 'var(--accent)' }}>{app.status}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: getRankColor(app.ranking), fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{app.ranking}</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: getRankColor(app.ranking) }}>{app.atsScore}%</div>
              </div>
            </div>

            <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
              <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div>
                  <h4 style={{ marginBottom: '1rem' }}>AI Feedback</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{app.aiFeedback?.suggestions || 'No suggestion available.'}</p>
                </div>
                <div>
                  <h4 style={{ marginBottom: '1rem', color: '#ef4444' }}>Missing Skills</h4>
                  <div className="flex" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
                    {app.aiFeedback?.missingKeywords?.length > 0 ? app.aiFeedback.missingKeywords.map(skill => (
                      <span key={skill} style={{ padding: '0.2rem 0.6rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '4px', fontSize: '0.8rem' }}>{skill}</span>
                    )) : <small style={{ color: 'var(--text-muted)' }}>None - Strong Match!</small>}
                  </div>
                </div>
              </div>
            </div>

            {app.interviewReport && (
              <div style={{ marginTop: '1.5rem', padding: '1.5rem', background: 'rgba(139, 92, 246, 0.05)', borderRadius: '12px', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                <h4 style={{ marginBottom: '1rem', color: '#8b5cf6', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MessageSquare size={18} /> AI Interview Report
                </h4>
                <p style={{ fontSize: '0.95rem', lineHeight: '1.6', fontStyle: 'italic' }}>"{app.interviewReport}"</p>
              </div>
            )}

            <div className="flex" style={{ marginTop: '2rem', justifyContent: 'flex-end', gap: '1rem' }}>
              {(app.status === 'Applied' || app.status === 'Screening') && (
                <button onClick={() => updateStatus(app._id, 'Shortlisted')} className="btn-secondary" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent)' }}>
                  <CheckCircle size={16} /> Shortlist Candidate
                </button>
              )}
              {(app.status === 'Shortlisted' || app.status === 'Interview') && (
                <button onClick={() => updateStatus(app._id, 'Interview')} className="btn-primary" style={{ background: '#8b5cf6' }}>
                  <MessageSquare size={16} /> {app.status === 'Interview' ? 'Resend Interview Invite' : 'Send Interview Invite'}
                </button>
              )}
              {app.status === 'Interview' && (
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button onClick={() => updateStatus(app._id, 'Hired')} className="btn-primary" style={{ background: '#10b981' }}>
                    <CheckCircle size={16} /> Hire Directly
                  </button>
                  <button 
                    onClick={() => {
                      const date = prompt("Enter Interview Date (e.g. May 5th, 10 AM):");
                      const place = prompt("Enter Interview Location (e.g. Office Room 4B or Zoom Link):");
                      if (date && place) updateStatus(app._id, 'OfflineInterview', { date, place });
                    }} 
                    className="btn-secondary" 
                    style={{ border: '1px solid var(--accent)', color: 'var(--accent)' }}
                  >
                    <Clock size={16} /> Schedule Offline
                  </button>
                </div>
              )}
              {app.status !== 'Rejected' && app.status !== 'Hired' && (
                <button onClick={() => updateStatus(app._id, 'Rejected')} className="btn-secondary" style={{ border: '1px solid #ef4444', color: '#ef4444' }}>
                  <XCircle size={16} /> Reject
                </button>
              )}
              {app.status === 'Hired' && app.offerLetterUrl && (
                <a href={`http://localhost:5000${app.offerLetterUrl}`} target="_blank" rel="noreferrer" className="btn-primary" style={{ background: '#10b981' }}>
                  <FileText size={16} /> View Offer Letter
                </a>
              )}
            </div>
          </div>
        )) : (
          <div className="glass-card" style={{ textAlign: 'center', padding: '4rem' }}>
            <Users size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
            <h3>No applicants yet</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicantList;

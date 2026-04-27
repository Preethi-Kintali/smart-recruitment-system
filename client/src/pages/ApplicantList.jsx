import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Clock, AlertTriangle, MessageSquare, Mail } from 'lucide-react';
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
        axios.get(`http://localhost:5000/api/jobs`), // In real app, fetch single job
        axios.get(`http://localhost:5000/api/applications/job/${jobId}`)
      ]);
      const currentJob = jobRes.data.find(j => j._id === jobId);
      setJob(currentJob);
      setApplications(appRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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

      <div className="grid">
        {applications.length > 0 ? applications.map(app => (
          <div key={app._id} className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '1.5rem' }}>{app.candidateId.fullName}</h3>
                <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Mail size={14} /> {app.candidateId.email} | <Clock size={14} /> {app.candidateId.experience} experience
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ 
                  background: getRankColor(app.ranking), 
                  color: 'white', 
                  padding: '0.25rem 0.75rem', 
                  borderRadius: '20px', 
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  display: 'inline-block'
                }}>
                  {app.ranking}
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', marginTop: '0.5rem', color: getRankColor(app.ranking) }}>
                  {app.atsScore}%
                </div>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <h4 style={{ color: 'var(--text-main)', marginBottom: '0.5rem' }}>Skills Match</h4>
                  <div className="flex" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
                    {app.candidateId.skills.map(skill => (
                      <span key={skill} style={{ padding: '0.2rem 0.6rem', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', fontSize: '0.8rem' }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 style={{ color: '#ef4444', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <AlertTriangle size={14} /> Missing Skills
                  </h4>
                  <div className="flex" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
                    {app.aiFeedback.missingKeywords.length > 0 ? app.aiFeedback.missingKeywords.map(skill => (
                      <span key={skill} style={{ padding: '0.2rem 0.6rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '4px', fontSize: '0.8rem' }}>
                        {skill}
                      </span>
                    )) : <small style={{ color: 'var(--text-muted)' }}>None - Strong Match!</small>}
                  </div>
                </div>
              </div>
              
              <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '8px' }}>
                <p style={{ fontSize: '0.9rem', fontStyle: 'italic', color: '#cbd5e1' }}>
                  <strong>AI Suggestion:</strong> {app.aiFeedback.suggestions}
                </p>
              </div>
            </div>

            <div className="flex" style={{ marginTop: '1.5rem', justifyContent: 'flex-end' }}>
              {app.ranking === 'Best Fit' && (
                <Link to={`/recruiter/interview/${app._id}`} className="btn-primary" style={{ background: 'var(--accent)' }}>
                  <MessageSquare size={16} /> Schedule Interview
                </Link>
              )}
              <button className="btn-primary" style={{ background: 'transparent', border: '1px solid #ef4444', color: '#ef4444' }}>
                Reject
              </button>
            </div>
          </div>
        )) : (
          <div className="glass-card" style={{ textAlign: 'center', padding: '4rem' }}>
            <Users size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
            <h3>No applicants yet</h3>
            <p>Share the job posting to start receiving applications.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicantList;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, Video, MapPin, Send } from 'lucide-react';
import api from '../api';

const ScheduleInterview = () => {
  const { appId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    mode: 'Online'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/interviews/schedule', {
        applicationId: appId,
        ...formData
      });
      alert('Interview Scheduled and AI Questions Generated!');
      navigate('/recruiter');
    } catch (err) {
      console.error(err);
      alert('Failed to schedule interview');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in">
      <h1>Schedule Interview</h1>
      <p>Invite the candidate and generate AI-powered assessment questions.</p>

      <div className="glass-card" style={{ maxWidth: '600px', marginTop: '2rem' }}>
        <form onSubmit={handleSubmit} className="grid">
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Interview Date</label>
            <input 
              type="date" 
              className="glass-input" 
              value={formData.date} 
              onChange={e => setFormData({...formData, date: e.target.value})} 
              required 
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Interview Time</label>
            <input 
              type="time" 
              className="glass-input" 
              value={formData.time} 
              onChange={e => setFormData({...formData, time: e.target.value})} 
              required 
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Interview Mode</label>
            <select 
              className="glass-input" 
              value={formData.mode} 
              onChange={e => setFormData({...formData, mode: e.target.value})}
              style={{ background: 'var(--bg-dark)' }}
            >
              <option value="Online">Online (Video Call)</option>
              <option value="In-Person">In-Person (Office)</option>
            </select>
          </div>

          <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '8px', fontSize: '0.9rem' }}>
            <p><strong>Note:</strong> Our AI will automatically generate custom technical and HR questions based on the candidate's resume and job requirements once you schedule.</p>
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }} disabled={loading}>
            <Calendar size={18} /> {loading ? 'Scheduling...' : 'Schedule & Notify Candidate'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ScheduleInterview;

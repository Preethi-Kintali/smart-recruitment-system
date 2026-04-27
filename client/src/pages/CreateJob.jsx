import React, { useState } from 'react';
import { Sparkles, Save, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const CreateJob = () => {
  const [formData, setFormData] = useState({
    title: '',
    skills: '',
    experience: '',
    qualification: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { user } = useAuth();

  const handleGenerateAI = async () => {
    if (!formData.title) return alert('Please enter a job title first');
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/jobs/generate-jd', {
        title: formData.title,
        skills: formData.skills,
        experience: formData.experience
      });
      setFormData({ ...formData, description: res.data.description });
    } catch (err) {
      console.error(err);
      alert('Failed to generate JD');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const skillsArray = formData.skills.split(',').map(s => s.trim());
      await axios.post('http://localhost:5000/api/jobs', {
        ...formData,
        skills: skillsArray,
        recruiterId: user?.id || user?._id
      });
      alert('Job Posted Successfully!');
      navigate('/recruiter');
    } catch (err) {
      console.error(err);
      alert('Failed to post job');
    }
  };

  return (
    <div className="container animate-fade-in">
      <Link to="/recruiter" className="flex" style={{ color: 'var(--text-muted)', marginBottom: '1rem', textDecoration: 'none' }}>
        <ArrowLeft size={18} /> Back to Dashboard
      </Link>
      <h1>Create New Job Opening</h1>
      
      <div className="glass-card" style={{ maxWidth: '800px' }}>
        <form onSubmit={handleSubmit} className="grid">
          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Job Title</label>
              <input 
                className="glass-input" 
                placeholder="e.g. Senior Frontend Engineer"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Experience Needed</label>
              <input 
                className="glass-input" 
                placeholder="e.g. 3-5 years"
                value={formData.experience}
                onChange={e => setFormData({...formData, experience: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Required Skills (Comma separated)</label>
            <input 
              className="glass-input" 
              placeholder="React, Node.js, TypeScript"
              value={formData.skills}
              onChange={e => setFormData({...formData, skills: e.target.value})}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label>Job Description</label>
              <button 
                type="button" 
                onClick={handleGenerateAI}
                className="btn-primary" 
                style={{ padding: '0.4rem 1rem', fontSize: '0.9rem', background: 'var(--accent)' }}
                disabled={loading}
              >
                <Sparkles size={16} /> {loading ? 'Generating...' : 'AI Auto-Generate'}
              </button>
            </div>
            <textarea 
              className="glass-input" 
              style={{ minHeight: '200px', resize: 'vertical' }}
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="Enter job details or use AI generator..."
              required
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            <Save size={18} /> Post Job
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateJob;

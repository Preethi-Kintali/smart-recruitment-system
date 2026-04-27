import React, { useState, useEffect } from 'react';
import { Upload, Send, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

const CandidateApply = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    skills: '',
    experience: '',
    education: ''
  });
  const [resume, setResume] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/jobs');
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedJob) return alert('Please select a job');
    if (!resume) return alert('Please upload your resume');

    setLoading(true);
    const data = new FormData();
    data.append('jobId', selectedJob);
    data.append('resume', resume);
    Object.keys(formData).forEach(key => data.append(key, formData[key]));

    try {
      const res = await axios.post('http://localhost:5000/api/applications', data);
      setResult(res.data);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert('Application submission failed');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="container animate-fade-in" style={{ textAlign: 'center' }}>
        <div className="glass-card" style={{ maxWidth: '600px', margin: '4rem auto' }}>
          <CheckCircle2 size={80} color="#10b981" style={{ marginBottom: '1.5rem' }} />
          <h1>Application Received!</h1>
          <p>Thank you, {formData.fullName}. Our AI has analyzed your profile.</p>
          
          <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', textAlign: 'left' }}>
            <h3>AI Match Analysis</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1rem 0' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>{result.atsScore}%</div>
              <div>ATS Compatibility Score</div>
            </div>
            <p><strong>Status:</strong> {result.ranking}</p>
            <p style={{ marginTop: '1rem' }}>{result.aiFeedback.suggestions}</p>
          </div>
          
          <button onClick={() => setSubmitted(false)} className="btn-primary" style={{ marginTop: '2rem', width: '100%' }}>
            Apply for another role
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in">
      <h1>Join Our Team</h1>
      <p>Submit your application and let our AI find the best fit for you.</p>

      <div className="glass-card" style={{ maxWidth: '800px', marginTop: '2rem' }}>
        <form onSubmit={handleSubmit} className="grid">
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Select Position</label>
            <select 
              className="glass-input" 
              value={selectedJob} 
              onChange={e => setSelectedJob(e.target.value)}
              required
              style={{ width: '100%', background: 'var(--bg-dark)' }}
            >
              <option value="">-- Choose a Role --</option>
              {jobs.map(job => (
                <option key={job._id} value={job._id}>{job.title}</option>
              ))}
            </select>
          </div>

          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div>
              <label>Full Name</label>
              <input className="glass-input" placeholder="John Doe" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} required />
            </div>
            <div>
              <label>Email Address</label>
              <input className="glass-input" type="email" placeholder="john@example.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
            </div>
          </div>

          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div>
              <label>Phone Number</label>
              <input className="glass-input" placeholder="+1 234 567 890" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
            </div>
            <div>
              <label>Experience (Years)</label>
              <input className="glass-input" placeholder="e.g. 4" value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} required />
            </div>
          </div>

          <div>
            <label>Skills (Comma separated)</label>
            <input className="glass-input" placeholder="React, Node.js, Python" value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} required />
          </div>

          <div>
            <label>Resume Upload (PDF/Doc)</label>
            <div 
              style={{ border: '2px dashed var(--border)', borderRadius: '12px', padding: '2rem', textAlign: 'center', cursor: 'pointer' }}
              onClick={() => document.getElementById('resume-upload').click()}
            >
              <Upload size={32} style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
              <p>{resume ? resume.name : 'Click to upload your resume'}</p>
              <input 
                id="resume-upload" 
                type="file" 
                style={{ display: 'none' }} 
                onChange={e => setResume(e.target.files[0])} 
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            <Send size={18} /> {loading ? 'Processing Application...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CandidateApply;

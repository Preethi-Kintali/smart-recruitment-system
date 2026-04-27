import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { UserPlus, Mail, Lock, User, Briefcase, Phone, Building, GraduationCap, AlertCircle, CheckCircle } from 'lucide-react';

const Signup = () => {
  const [role, setRole] = useState('candidate');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    companyName: '',
    companyEmail: '',
    companyType: '',
    designation: '',
    phoneNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = role === 'recruiter' ? '/auth/signup/recruiter' : '/auth/signup/candidate';
      const res = await api.post(endpoint, formData);
      
      if (role === 'recruiter') {
        setSuccess(res.data.message);
        setFormData({ name: '', email: '', password: '', phone: '', companyName: '', companyEmail: '', companyType: '', designation: '', phoneNumber: '' });
      } else {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        navigate('/jobs');
        window.location.reload(); // Refresh to update AuthContext
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '600px', marginTop: '2rem' }}>
      <div className="glass-card animate-fade-in">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2>Join SmartRecruit</h2>
          <p style={{ color: 'var(--text-muted)' }}>Choose your role and create your account</p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <button 
            className={role === 'candidate' ? 'btn-primary' : 'btn-secondary'} 
            style={{ flex: 1, padding: '1rem' }}
            onClick={() => { setRole('candidate'); setError(''); setSuccess(''); }}
          >
            <User size={18} style={{ marginRight: '0.5rem' }} /> Candidate
          </button>
          <button 
            className={role === 'recruiter' ? 'btn-primary' : 'btn-secondary'} 
            style={{ flex: 1, padding: '1rem' }}
            onClick={() => { setRole('recruiter'); setError(''); setSuccess(''); }}
          >
            <Building size={18} style={{ marginRight: '0.5rem' }} /> Recruiter
          </button>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={18} /> {error}
          </div>
        )}

        {success && (
          <div style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={18} /> {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid" style={{ gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Full Name</label>
            <div style={{ position: 'relative' }}>
              <User style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
              <input name="name" className="glass-input" style={{ paddingLeft: '3rem' }} placeholder="John Doe" value={formData.name} onChange={handleChange} required />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Personal Email</label>
            <div style={{ position: 'relative' }}>
              <Mail style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
              <input name="email" type="email" className="glass-input" style={{ paddingLeft: '3rem' }} placeholder="john@example.com" value={formData.email} onChange={handleChange} required />
            </div>
          </div>

          {role === 'candidate' && (
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Phone Number</label>
              <div style={{ position: 'relative' }}>
                <Phone style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                <input name="phone" className="glass-input" style={{ paddingLeft: '3rem' }} placeholder="+1 234 567 890" value={formData.phone} onChange={handleChange} required />
              </div>
            </div>
          )}

          {role === 'recruiter' && (
            <>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Company Name</label>
                <div style={{ position: 'relative' }}>
                  <Building style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                  <input name="companyName" className="glass-input" style={{ paddingLeft: '3rem' }} placeholder="Tech Solutions Inc." value={formData.companyName} onChange={handleChange} required />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Work Email</label>
                <div style={{ position: 'relative' }}>
                  <Mail style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                  <input name="companyEmail" type="email" className="glass-input" style={{ paddingLeft: '3rem' }} placeholder="hr@techsolutions.com" value={formData.companyEmail} onChange={handleChange} required />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Designation</label>
                <div style={{ position: 'relative' }}>
                  <Briefcase style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                  <input name="designation" className="glass-input" style={{ paddingLeft: '3rem' }} placeholder="HR Manager" value={formData.designation} onChange={handleChange} required />
                </div>
              </div>
            </>
          )}

          <div style={{ gridColumn: 'span 1' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
              <input name="password" type="password" className="glass-input" style={{ paddingLeft: '3rem' }} placeholder="••••••••" value={formData.password} onChange={handleChange} required />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ gridColumn: 'span 1', padding: '1rem' }} disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;

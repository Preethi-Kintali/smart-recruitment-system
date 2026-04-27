import React, { useState, useEffect } from 'react';
import api from '../api';
import { Check, X, ShieldAlert, UserCheck, Search, Building } from 'lucide-react';

const RecruiterManagement = () => {
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchRecruiters();
  }, []);

  const fetchRecruiters = async () => {
    try {
      const res = await api.get('/admin/recruiters');
      setRecruiters(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/admin/recruiter/${id}/status`, { status });
      fetchRecruiters();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const filtered = recruiters.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase()) || 
    r.companyName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>Recruiter Management</h1>
          <p style={{ color: 'var(--text-muted)' }}>Approve or restrict company access</p>
        </div>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search recruiters..." 
            className="glass-input" 
            style={{ paddingLeft: '3rem', width: '300px' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }}>
              <th style={{ padding: '1rem' }}>Recruiter</th>
              <th style={{ padding: '1rem' }}>Company Details</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '1.5rem 1rem' }}>
                  <div style={{ fontWeight: 'bold' }}>{r.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{r.email}</div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Building size={14} style={{ color: 'var(--accent)' }} />
                    {r.companyName}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{r.designation}</div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    padding: '0.2rem 0.8rem', 
                    borderRadius: '20px', 
                    fontSize: '0.8rem',
                    background: r.status === 'approved' || r.status === 'active' ? 'rgba(16, 185, 129, 0.1)' : 
                               r.status === 'pending' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: r.status === 'approved' || r.status === 'active' ? '#10b981' : 
                           r.status === 'pending' ? '#f59e0b' : '#ef4444',
                    textTransform: 'capitalize'
                  }}>
                    {r.status}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {r.status === 'pending' && (
                      <>
                        <button onClick={() => updateStatus(r._id, 'approved')} className="btn-primary" style={{ padding: '0.4rem', borderRadius: '8px', background: '#10b981' }} title="Approve">
                          <Check size={18} />
                        </button>
                        <button onClick={() => updateStatus(r._id, 'rejected')} className="btn-secondary" style={{ padding: '0.4rem', borderRadius: '8px', background: '#ef4444' }} title="Reject">
                          <X size={18} />
                        </button>
                      </>
                    )}
                    {(r.status === 'approved' || r.status === 'active') && (
                      <button onClick={() => updateStatus(r._id, 'blocked')} className="btn-secondary" style={{ padding: '0.4rem', borderRadius: '8px', background: '#f59e0b' }} title="Block">
                        <ShieldAlert size={18} />
                      </button>
                    )}
                    {(r.status === 'blocked' || r.status === 'rejected') && (
                      <button onClick={() => updateStatus(r._id, 'active')} className="btn-primary" style={{ padding: '0.4rem', borderRadius: '8px' }} title="Activate">
                        <UserCheck size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecruiterManagement;

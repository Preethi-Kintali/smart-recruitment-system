import React, { useState, useEffect } from 'react';
import api from '../api';
import { Users, Briefcase, FileCheck, TrendingUp, UserPlus, Clock } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [detailData, setDetailData] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/stats');
      setStats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = async (type) => {
    if (selectedDetail === type) {
      setSelectedDetail(null);
      setDetailData([]);
      return;
    }

    setSelectedDetail(type);
    setDetailLoading(true);
    try {
      const res = await api.get(`/admin/${type}`);
      setDetailData(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch details');
    } finally {
      setDetailLoading(false);
    }
  };

  if (loading) return <div className="container">Loading...</div>;

  const statCards = [
    { title: 'Total Recruiters', value: stats.totalRecruiters, icon: <Users />, color: '#6366f1', type: 'recruiters' },
    { title: 'Total Candidates', value: stats.totalCandidates, icon: <UserPlus />, color: '#10b981', type: 'candidates' },
    { title: 'Applications', value: stats.totalApplications, icon: <Briefcase />, color: '#f59e0b', type: 'applications' },
    { title: 'Total Hired', value: stats.totalHired, icon: <FileCheck />, color: '#8b5cf6', type: 'hired' }
  ];

  return (
    <div className="container animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1>Admin Overview</h1>
        <p style={{ color: 'var(--text-muted)' }}>System-wide recruitment analytics and monitoring</p>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', marginBottom: '2rem' }}>
        {statCards.map((s, i) => (
          <div 
            key={i} 
            className={`glass-card ${selectedDetail === s.type ? 'active-card' : ''}`} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1.5rem', 
              cursor: 'pointer',
              border: selectedDetail === s.type ? `1px solid ${s.color}` : '1px solid transparent',
              transition: 'all 0.3s ease'
            }}
            onClick={() => handleCardClick(s.type)}
          >
            <div style={{ padding: '1rem', borderRadius: '12px', background: `${s.color}20`, color: s.color }}>
              {s.icon}
            </div>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.2rem' }}>{s.title}</p>
              <h2 style={{ margin: 0 }}>{s.value}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* Detail View Section */}
      {selectedDetail && (
        <div className="glass-card animate-slide-up" style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ textTransform: 'capitalize' }}>{selectedDetail} Details</h3>
            <button className="btn-secondary" onClick={() => setSelectedDetail(null)} style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}>Close</button>
          </div>

          {detailLoading ? (
            <p>Loading details...</p>
          ) : detailData.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No records found.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th style={{ textAlign: 'left', padding: '1rem' }}>Name</th>
                    <th style={{ textAlign: 'left', padding: '1rem' }}>
                      {selectedDetail === 'applications' || selectedDetail === 'hired' ? 'Job' : 'Email'}
                    </th>
                    <th style={{ textAlign: 'left', padding: '1rem' }}>
                      {selectedDetail === 'recruiters' ? 'Company' : selectedDetail === 'candidates' ? 'Skills' : 'Status'}
                    </th>
                    <th style={{ textAlign: 'left', padding: '1rem' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {detailData.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '1rem' }}>
                        {selectedDetail === 'applications' || selectedDetail === 'hired' 
                          ? item.candidateId?.fullName || 'N/A' 
                          : item.fullName}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        {selectedDetail === 'applications' || selectedDetail === 'hired' 
                          ? item.jobId?.title || 'N/A' 
                          : item.email}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        {selectedDetail === 'recruiters' ? (item.companyName || 'N/A') : 
                         selectedDetail === 'candidates' ? (item.skills?.slice(0, 3).join(', ') || 'N/A') : 
                         item.status}
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {new Date(item.appliedAt || item.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        <div className="glass-card">
          <h3>Conversion Performance</h3>
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', fontWeight: 'bold', color: 'var(--accent)' }}>{stats.conversionRate}%</div>
            <p style={{ color: 'var(--text-muted)' }}>Overall Application to Hire Conversion</p>
            <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '5px', marginTop: '2rem', overflow: 'hidden' }}>
              <div style={{ width: `${stats.conversionRate}%`, height: '100%', background: 'var(--accent)' }}></div>
            </div>
          </div>
        </div>

        <div className="glass-card">
          <h3>Recent System Activity</h3>
          <div style={{ marginTop: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <Clock size={18} style={{ color: 'var(--accent)' }} />
              <div>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>New Recruiter Registration</p>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>2 minutes ago</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <TrendingUp size={18} style={{ color: '#10b981' }} />
              <div>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>Candidate Hired at Google</p>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>1 hour ago</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <Users size={18} style={{ color: '#f59e0b' }} />
              <div>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>50 New Candidates Joined</p>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Today</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

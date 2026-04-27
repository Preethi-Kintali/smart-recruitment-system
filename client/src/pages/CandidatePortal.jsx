import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Search, MapPin, Briefcase, DollarSign, ArrowRight, Filter } from 'lucide-react';

const CandidatePortal = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const [expandedJob, setExpandedJob] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/jobs');
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(j => {
    const matchesSearch = j.title.toLowerCase().includes(search.toLowerCase()) || 
                         j.skills.some(s => s.toLowerCase().includes(search.toLowerCase()));
    const matchesFilter = filter === 'All' || j.employmentType === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="container animate-fade-in">
      <div style={{ marginBottom: '3rem' }}>
        <h1>Discover Opportunities</h1>
        <p style={{ color: 'var(--text-muted)' }}>Find your next career move with SmartRecruit</p>
      </div>

      <div className="glass-card" style={{ marginBottom: '3rem', padding: '1.5rem' }}>
        <div className="grid" style={{ gridTemplateColumns: '1fr auto auto', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search by role or skill (e.g. React, Node.js)" 
              className="glass-input" 
              style={{ paddingLeft: '3rem' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select className="glass-input" style={{ width: '200px' }} value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="All">All Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
          <button className="btn-primary" style={{ padding: '0.8rem 1.5rem' }}>
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))' }}>
        {filteredJobs.length > 0 ? filteredJobs.map(j => (
          <div key={j._id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0 }}>{j.title}</h3>
                <span style={{ fontSize: '0.8rem', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent)', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                  {j.employmentType || 'Full-time'}
                </span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <MapPin size={14} /> {j.location || 'Remote'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Briefcase size={14} /> {j.experience}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <DollarSign size={14} /> {j.salary || 'Competitive'}
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
                {j.skills.map((s, idx) => (
                  <span key={idx} style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', padding: '0.3rem 0.7rem', borderRadius: '20px' }}>
                    {s}
                  </span>
                ))}
              </div>
              
              <button 
                onClick={() => setExpandedJob(expandedJob === j._id ? null : j._id)}
                className="btn-secondary" 
                style={{ width: '100%', justifyContent: 'center', marginBottom: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', padding: '0.6rem', borderRadius: '8px', color: 'var(--accent)' }}
              >
                {expandedJob === j._id ? 'Hide Description' : 'View Description'}
              </button>

              {expandedJob === j._id && (
                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                  <p style={{ whiteSpace: 'pre-wrap', color: 'var(--text-main)' }}>{j.description}</p>
                </div>
              )}
            </div>
            <Link to={`/apply/${j._id}`} className="btn-primary" style={{ width: '100%', textAlign: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              Apply Now <ArrowRight size={18} />
            </Link>
          </div>
        )) : (
          <div className="glass-card" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem' }}>
            <p style={{ color: 'var(--text-muted)' }}>No jobs found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidatePortal;

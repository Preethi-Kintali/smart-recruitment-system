import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { LayoutDashboard, UserPlus, Briefcase } from 'lucide-react';
import './index.css';

// Import Pages
import RecruiterDashboard from './pages/RecruiterDashboard';
import CreateJob from './pages/CreateJob';
import CandidateApply from './pages/CandidateApply';
import ApplicantList from './pages/ApplicantList';
import ScheduleInterview from './pages/ScheduleInterview';

const Home = () => (
  <div className="container animate-fade-in" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
    <h1 style={{ fontSize: '4rem' }}>Smart Recruitment AI</h1>
    <p style={{ fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto' }}>
      Revolutionize your hiring process with AI-powered candidate ranking, automated resume parsing, and intelligent workflow management.
    </p>
    
    <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', marginTop: '4rem' }}>
      <div className="glass-card">
        <LayoutDashboard size={48} color="#6366f1" style={{ marginBottom: '1.5rem' }} />
        <h2>Recruiter Dashboard</h2>
        <p>Post jobs, rank candidates with AI, and manage interviews seamlessly.</p>
        <Link to="/recruiter" className="btn-primary" style={{ marginTop: '2rem' }}>Enter Recruiter Portal</Link>
      </div>
      <div className="glass-card">
        <Briefcase size={48} color="#a855f7" style={{ marginBottom: '1.5rem' }} />
        <h2>Candidate Portal</h2>
        <p>Find your dream job and get instant AI feedback on your application.</p>
        <Link to="/apply" className="btn-primary" style={{ marginTop: '2rem' }}>Explore Opportunities</Link>
      </div>
    </div>
  </div>
);

const App = () => {
  return (
    <Router>
      <nav style={{ padding: '1rem 5%', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'white', fontWeight: 'bold', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div style={{ width: '35px', height: '35px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', borderRadius: '10px', boxShadow: '0 0 15px var(--primary-glow)' }}></div>
          <span>SmartHire AI</span>
        </Link>
        <div className="flex" style={{ gap: '2rem' }}>
          <Link to="/recruiter" style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 500 }}>Recruiter</Link>
          <Link to="/apply" style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 500 }}>Careers</Link>
        </div>
      </nav>
      
      <div style={{ minHeight: 'calc(100vh - 70px)' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recruiter" element={<RecruiterDashboard />} />
          <Route path="/recruiter/create-job" element={<CreateJob />} />
          <Route path="/recruiter/job/:jobId" element={<ApplicantList />} />
          <Route path="/recruiter/interview/:appId" element={<ScheduleInterview />} />
          <Route path="/apply" element={<CandidateApply />} />
        </Routes>
      </div>

      <footer style={{ padding: '3rem', borderTop: '1px solid var(--border)', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>© 2026 SmartHire AI Recruitment System. Built with Antigravity AI.</p>
      </footer>
    </Router>
  );
};

export default App;

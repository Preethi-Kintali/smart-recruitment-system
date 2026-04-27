import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Layout, LogOut, User, Briefcase, Users, PieChart, Search, FileText, Sun, Moon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = React.useState(true);

  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setIsDarkMode(false);
      document.body.classList.add('light-mode');
    }
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.body.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const renderLinks = () => {
    if (!user) {
      return (
        <>
          <Link to="/" className="nav-link" style={{ fontWeight: '600' }}>Home</Link>
          <Link to="/login" className="btn-primary" style={{ 
            padding: '0.6rem 2rem', 
            borderRadius: '50px',
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.4)',
            color: 'white',
            textDecoration: 'none',
            fontSize: '0.95rem',
            transition: 'all 0.3s ease'
          }}>Login</Link>
          <Link to="/signup" className="btn-primary" style={{ 
            padding: '0.6rem 2rem', 
            borderRadius: '50px',
            background: 'linear-gradient(135deg, var(--accent), #4f46e5)',
            border: 'none',
            color: 'white',
            textDecoration: 'none',
            fontSize: '0.95rem',
            fontWeight: '600',
            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
            transition: 'all 0.3s ease'
          }}>Sign Up</Link>
        </>
      );
    }

    switch (user.role) {
      case 'admin':
        return (
          <>
            <Link to="/admin" className="nav-link"><PieChart size={18} /> Overview</Link>
            <Link to="/admin/recruiters" className="nav-link"><Users size={18} /> Recruiters</Link>
            <button onClick={handleLogout} className="nav-link" style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
              <LogOut size={18} /> Logout
            </button>
          </>
        );
      case 'recruiter':
        return (
          <>
            <Link to="/recruiter" className="nav-link"><Layout size={18} /> Dashboard</Link>
            <Link to="/recruiter/create-job" className="nav-link"><Briefcase size={18} /> Post Job</Link>
            <button onClick={handleLogout} className="nav-link" style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
              <LogOut size={18} /> Logout
            </button>
          </>
        );
      case 'candidate':
        return (
          <>
            <Link to="/jobs" className="nav-link"><Search size={18} /> Find Jobs</Link>
            <Link to="/my-applications" className="nav-link"><FileText size={18} /> My Applications</Link>
            <Link to="/profile" className="nav-link"><User size={18} /> Profile</Link>
            <button onClick={handleLogout} className="nav-link" style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
              <LogOut size={18} /> Logout
            </button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <nav className="navbar" style={{ background: 'var(--nav-bg)', backdropFilter: 'blur(10px)', sticky: 'top', zIndex: 1000 }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 2rem' }}>
        <Link to="/" className="nav-logo">
          SmartRecruit
        </Link>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {renderLinks()}
          <button 
            onClick={toggleTheme} 
            className="nav-link" 
            style={{ 
              border: '1px solid var(--border)', 
              background: 'rgba(255,255,255,0.05)', 
              borderRadius: '50%', 
              width: '40px', 
              height: '40px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              cursor: 'pointer',
              marginLeft: '1rem'
            }}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun size={20} color="var(--accent)" /> : <Moon size={20} color="var(--primary)" />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

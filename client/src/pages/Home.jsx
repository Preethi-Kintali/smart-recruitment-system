import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Zap, Target, Mail, Phone, MapPin } from 'lucide-react';

const Home = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="container" style={{ textAlign: 'center', padding: '6rem 1rem' }}>
        <h1 className="hero-title" style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>
          Smart Recruitment System
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '800px', margin: '0 auto 3rem' }}>
          Automate your full hiring pipeline from job posting to offer letters using state-of-the-art AI workflows, real-time analytics, and automated screening.
        </p>
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginTop: '1rem' }}>
          <Link to="/signup" className="btn-primary" style={{ padding: '1.2rem 3rem', fontSize: '1.1rem', borderRadius: '12px' }}>
            Get Started <ArrowRight size={20} style={{ marginLeft: '0.8rem' }} />
          </Link>
          <Link to="/login" className="btn-secondary" style={{ padding: '1.2rem 3rem', fontSize: '1.1rem', borderRadius: '12px' }}>
            Sign In
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ background: 'rgba(255,255,255,0.02)', padding: '6rem 0' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '4rem' }}>Key Features</h2>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            <div className="glass-card">
              <Zap size={40} style={{ color: 'var(--accent)', marginBottom: '1.5rem' }} />
              <h3>AI-Powered Screening</h3>
              <p>Automated ATS scoring and skill gap analysis to identify the best talent instantly.</p>
            </div>
            <div className="glass-card">
              <Shield size={40} style={{ color: 'var(--accent)', marginBottom: '1.5rem' }} />
              <h3>Admin Controlled</h3>
              <p>Secure recruiter verification system ensuring only legitimate companies can post jobs.</p>
            </div>
            <div className="glass-card">
              <Target size={40} style={{ color: 'var(--accent)', marginBottom: '1.5rem' }} />
              <h3>End-to-End Workflow</h3>
              <p>From job creation with AI JDs to automated offer letter generation and interview invites.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="container" style={{ padding: '6rem 1rem' }}>
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', alignItems: 'center' }}>
          <div>
            <h2>Why Choose SmartRecruit?</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
              We've combined modern AI with intuitive recruitment workflows to save thousands of hours for HR teams and provide a seamless experience for candidates.
            </p>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                <Zap size={18} style={{ color: 'var(--accent)', marginRight: '1rem' }} /> 90% Faster Screening
              </li>
              <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                <Zap size={18} style={{ color: 'var(--accent)', marginRight: '1rem' }} /> Automated Email Communication
              </li>
              <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                <Zap size={18} style={{ color: 'var(--accent)', marginRight: '1rem' }} /> Real-time Analytics & Dashboard
              </li>
            </ul>
          </div>
          <div className="glass-card" style={{ padding: '4rem', textAlign: 'center' }}>
            <h3 style={{ fontSize: '3rem', color: 'var(--accent)' }}>100+</h3>
            <p>Companies Hired</p>
            <h3 style={{ fontSize: '3rem', color: 'var(--accent)', marginTop: '2rem' }}>5000+</h3>
            <p>Applications Processed</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section style={{ background: 'rgba(255,255,255,0.02)', padding: '6rem 0' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '4rem' }}>Get In Touch</h2>
          <div className="grid" style={{ gridTemplateColumns: '1fr 1.5fr' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
                <Mail style={{ color: 'var(--accent)', marginRight: '1rem' }} />
                <span>support@smartrecruit.com</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
                <Phone style={{ color: 'var(--accent)', marginRight: '1rem' }} />
                <span>+1 (555) 000-0000</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
                <MapPin style={{ color: 'var(--accent)', marginRight: '1rem' }} />
                <span>123 Innovation Way, Tech City</span>
              </div>
            </div>
            <form className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <input type="text" placeholder="Your Name" className="glass-input" />
              <input type="email" placeholder="Your Email" className="glass-input" />
              <textarea placeholder="Your Message" className="glass-input" style={{ minHeight: '150px' }}></textarea>
              <button type="button" className="btn-primary">Send Message</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

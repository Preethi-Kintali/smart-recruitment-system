import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Mail, Phone, Briefcase, GraduationCap, Award, FileText } from 'lucide-react';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/profile', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setProfile(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container">Loading...</div>;
  if (!profile) return <div className="container">No profile data found.</div>;

  const { user, profileData } = profile;

  return (
    <div className="container animate-fade-in">
      <div style={{ marginBottom: '3rem' }}>
        <h1>My Profile</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage your personal information and resume details</p>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        {/* Basic Info */}
        <div className="glass-card" style={{ height: 'fit-content' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--primary)', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={48} color="white" />
            </div>
            <h2 style={{ margin: 0 }}>{user.name}</h2>
            <p style={{ textTransform: 'capitalize', color: 'var(--accent)', fontWeight: 'bold' }}>{user.role}</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Mail size={18} style={{ color: 'var(--text-muted)' }} />
              <div>
                <p style={{ fontSize: '0.8rem', margin: 0 }}>Email</p>
                <p style={{ margin: 0 }}>{user.email}</p>
              </div>
            </div>
            {profileData?.phone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Phone size={18} style={{ color: 'var(--text-muted)' }} />
                <div>
                  <p style={{ fontSize: '0.8rem', margin: 0 }}>Phone</p>
                  <p style={{ margin: 0 }}>{profileData.phone}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Professional Details (Candidate) */}
        <div className="glass-card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
            <Briefcase size={20} style={{ color: 'var(--accent)' }} /> Professional Information
          </h3>

          {profileData ? (
            <div className="grid" style={{ gap: '2.5rem' }}>
              <div>
                <h4 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>SKILLS</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                  {profileData.skills?.map((s, i) => (
                    <span key={i} style={{ padding: '0.4rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '20px', fontSize: '0.9rem' }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <div>
                  <h4 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>EXPERIENCE</h4>
                  <p style={{ margin: 0 }}>{profileData.experience || 'Not specified'}</p>
                </div>
                <div>
                  <h4 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>EDUCATION</h4>
                  <p style={{ margin: 0 }}>{profileData.education || 'Not specified'}</p>
                </div>
              </div>

              {profileData.projects?.length > 0 && (
                <div>
                  <h4 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>PROJECTS</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {profileData.projects.map((p, i) => (
                      <div key={i} style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', borderLeft: '4px solid var(--accent)' }}>
                        {p}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {profileData.resumeUrl && (
                <div style={{ marginTop: '1rem', padding: '1.5rem', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '12px', border: '1px dashed var(--primary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <FileText size={24} style={{ color: 'var(--primary)' }} />
                      <div>
                        <p style={{ fontWeight: 'bold', margin: 0 }}>My Resume</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Auto-extracted from your last application</p>
                      </div>
                    </div>
                    <a href={`http://localhost:5000/${profileData.resumeUrl}`} target="_blank" rel="noreferrer" className="btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}>
                      View PDF
                    </a>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem' }}>
              <Award size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
              <p>You haven't completed your professional profile yet.</p>
              <p style={{ fontSize: '0.9rem' }}>Apply for a job to automatically extract your skills from your resume!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

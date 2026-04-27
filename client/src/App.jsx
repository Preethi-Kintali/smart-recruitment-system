import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import RecruiterDashboard from './pages/RecruiterDashboard';
import CreateJob from './pages/CreateJob';
import ApplicantList from './pages/ApplicantList';
import AdminDashboard from './pages/AdminDashboard';
import RecruiterManagement from './pages/RecruiterManagement';
import CandidatePortal from './pages/CandidatePortal';
import MyApplications from './pages/MyApplications';
import CandidateApply from './pages/CandidateApply';
import Profile from './pages/Profile';
import MockInterview from './pages/MockInterview';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main style={{ minHeight: '80vh', padding: '2rem 0' }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={
                <PublicRoute>
                  <Home />
                </PublicRoute>
              } />
              <Route path="/login" element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } />
              <Route path="/signup" element={
                <PublicRoute>
                  <Signup />
                </PublicRoute>
              } />
              <Route path="/apply/:jobId" element={<CandidateApply />} />

              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute roles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/recruiters" element={
                <ProtectedRoute roles={['admin']}>
                  <RecruiterManagement />
                </ProtectedRoute>
              } />

              {/* Recruiter Routes */}
              <Route path="/recruiter" element={
                <ProtectedRoute roles={['recruiter']}>
                  <RecruiterDashboard />
                </ProtectedRoute>
              } />
              <Route path="/recruiter/create-job" element={
                <ProtectedRoute roles={['recruiter']}>
                  <CreateJob />
                </ProtectedRoute>
              } />
              <Route path="/recruiter/job/:jobId" element={
                <ProtectedRoute roles={['recruiter']}>
                  <ApplicantList />
                </ProtectedRoute>
              } />

              {/* Candidate Routes */}
              <Route path="/jobs" element={
                <ProtectedRoute roles={['candidate']}>
                  <CandidatePortal />
                </ProtectedRoute>
              } />
              <Route path="/my-applications" element={
                <ProtectedRoute roles={['candidate']}>
                  <MyApplications />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute roles={['candidate', 'recruiter', 'admin']}>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/mock-interview/:appId" element={
                <ProtectedRoute roles={['candidate']}>
                  <MockInterview />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <footer style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            &copy; 2026 Smart Recruitment System. All rights reserved.
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

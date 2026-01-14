import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { InstructorDashboard } from './pages/InstructorDashboard';
import { CoursesPage } from './pages/CoursesPage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { AssignmentsPage } from './pages/AssignmentsPage';
import { AssignmentDetailPage } from './pages/AssignmentDetailPage';
import { SubmissionsPage } from './pages/SubmissionsPage';
import { GradingPage } from './pages/GradingPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';

function ProtectedRoute({ element, user, requiredRole = null }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }
  return element;
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Header user={user} onLogout={handleLogout} />
      
      {user && <Sidebar user={user} />}

      <div className={user ? 'ml-64 pt-16 min-h-screen bg-base' : 'pt-16'}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              user ? (
                <div className="px-8 py-6">
                  {user.role === 'instructor' ? (
                    <InstructorDashboard user={user} />
                  ) : (
                    <StudentDashboard user={user} />
                  )}
                </div>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/courses"
            element={
              user ? (
                <div className="px-8 py-6">
                  <CoursesPage user={user} />
                </div>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/courses/:id"
            element={
              user ? (
                <div className="px-8 py-6">
                  <CourseDetailPage user={user} />
                </div>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/assignments"
            element={
              user ? (
                <div className="px-8 py-6">
                  <AssignmentsPage user={user} />
                </div>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/assignments/:id"
            element={
              user ? (
                <div className="px-8 py-6">
                  <AssignmentDetailPage user={user} />
                </div>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/submissions"
            element={
              user?.role === 'instructor' ? (
                <div className="px-8 py-6">
                  <SubmissionsPage user={user} />
                </div>
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />

          <Route
            path="/submissions/:id/grade"
            element={
              user?.role === 'instructor' ? (
                <div className="px-8 py-6">
                  <GradingPage user={user} />
                </div>
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />

          <Route
            path="/profile"
            element={
              user ? (
                <div className="px-8 py-6">
                  <ProfilePage user={user} setUser={setUser} />
                </div>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/settings"
            element={
              user ? (
                <div className="px-8 py-6">
                  <SettingsPage user={user} />
                </div>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} replace />} />
        </Routes>
      </div>

      {!user && <Footer />}
    </BrowserRouter>
  );
}

export default App;

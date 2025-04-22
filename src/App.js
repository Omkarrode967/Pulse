import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Team from './components/Team';
import Projects from './components/Projects';
import ProjectDetails from './components/ProjectDetails';
import TeamDetails from './components/TeamDetails';
import ViewTeam from './components/ViewTeam';
import TeamMembers from './components/TeamMembers';
import { ThemeProvider } from './context/ThemeContext';
import EmailNotifications from './components/EmailNotifications';
import EmailSetup from './components/EmailSetup';
import Teams from './components/Teams';
import Tasks from './components/Tasks';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Profile from './components/Profile';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Dashboard from './components/Dashboard';
import TaskManagement from './components/TaskManagement';
import Settings from './components/Settings';

// Protected Route component
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
}

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="App">
      <div className="landing-container">
        <h1 className="main-title">
          Streamline Your Team, Tasks & Projects – All in One Place!
        </h1>
        <p className="subtitle">
          Pulse helps you manage projects, assign tasks, and collaborate efficiently with your teams.
        </p>
        <button className="cta-button" onClick={() => navigate('/login')}>Get Started</button>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <div className="app">
            <Navbar />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/home" element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } />
              <Route path="/projects" element={
                <ProtectedRoute>
                  <Projects />
                </ProtectedRoute>
              } />
              <Route path="/projects/:id" element={
                <ProtectedRoute>
                  <ProjectDetails />
                </ProtectedRoute>
              } />
              <Route path="/projects/:projectId/teams/:teamId" element={
                <ProtectedRoute>
                  <TeamDetails />
                </ProtectedRoute>
              } />
              <Route path="/create-team" element={
                <ProtectedRoute>
                  <Team />
                </ProtectedRoute>
              } />
              <Route path="/team/:teamId" element={
                <ProtectedRoute>
                  <ViewTeam />
                </ProtectedRoute>
              } />
              <Route path="/team/:teamId/members" element={
                <ProtectedRoute>
                  <TeamMembers />
                </ProtectedRoute>
              } />
              <Route path="/email-notifications" element={
                <ProtectedRoute>
                  <EmailNotifications />
                </ProtectedRoute>
              } />
              <Route path="/email-setup" element={
                <ProtectedRoute>
                  <EmailSetup />
                </ProtectedRoute>
              } />
              <Route path="/teams" element={
                <ProtectedRoute>
                  <Teams />
                </ProtectedRoute>
              } />
              <Route path="/tasks" element={
                <ProtectedRoute>
                  <Tasks />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/task-management" element={
                <ProtectedRoute>
                  <TaskManagement />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;

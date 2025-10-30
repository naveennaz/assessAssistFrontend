import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import './App.css';

// Import components
import PsychologistList from './components/Psychologists/PsychologistList';
import PsychologistForm from './components/Psychologists/PsychologistForm';
import PatientList from './components/Patients/PatientList';
import PatientForm from './components/Patients/PatientForm';
import AssessmentList from './components/Assessments/AssessmentList';
import AssessmentForm from './components/Assessments/AssessmentForm';
import AssessmentDetail from './components/Assessments/AssessmentDetail';
import AssessmentTake from './components/Assessments/AssessmentTake';
import Dashboard from './components/Dashboard/Dashboard';
import UserList from './components/Users/UserList';
import UserForm from './components/Users/UserForm';
import RoleList from './components/Roles/RoleList';
import RoleForm from './components/Roles/RoleForm';
import PermissionList from './components/Permissions/PermissionList';
import PermissionForm from './components/Permissions/PermissionForm';
import Login from './components/Auth/Login';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import PermissionGuard from './components/Auth/PermissionGuard';
import PermissionRoute from './components/Auth/PermissionRoute';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout, isAuthenticated, loading, hasPermission, hasAnyPermission } = useAuth();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.2rem',
        color: '#667eea'
      }}>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="App">
      <nav className="navbar">
        <div className="nav-container">
          <button className="menu-toggle" onClick={toggleSidebar}>
            ☰
          </button>
          <Link to="/" className="nav-logo">
            🧠 AssessAssist
          </Link>
          <div className="nav-user">
            <span className="user-name">
              {user?.firstName} {user?.lastName}
            </span>
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="app-container">
        <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <nav className="sidebar-nav">
            <Link to="/" className="sidebar-link">
              <span className="sidebar-icon">📊</span>
              <span className="sidebar-text">Dashboard</span>
            </Link>
            
            {/* Users - Show if user has read permission */}
            {hasAnyPermission(['READ_USERS', 'ALL_USERS']) && (
              <Link to="/users" className="sidebar-link">
                <span className="sidebar-icon">👥</span>
                <span className="sidebar-text">Users</span>
              </Link>
            )}
            
            {/* Roles - Show if user has read permission */}
            {hasAnyPermission(['READ_ROLES', 'ALL_ROLES']) && (
              <Link to="/roles" className="sidebar-link">
                <span className="sidebar-icon">🔐</span>
                <span className="sidebar-text">Roles</span>
              </Link>
            )}
            
            {/* Patients - Show if user has read permission */}
            {hasAnyPermission(['READ_PATIENTS', 'ALL_PATIENTS']) && (
              <Link to="/patients" className="sidebar-link">
                <span className="sidebar-icon">🏥</span>
                <span className="sidebar-text">Patients</span>
              </Link>
            )}
            
            {/* Assessments - Show if user has read permission */}
            {hasAnyPermission(['READ_ASSESSMENTS', 'ALL_ASSESSMENTS']) && (
              <Link to="/assessments" className="sidebar-link">
                <span className="sidebar-icon">📋</span>
                <span className="sidebar-text">Assessments</span>
              </Link>
            )}
          </nav>
        </aside>

        <main className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            
            {/* User Routes - Require permissions */}
            <Route 
              path="/users" 
              element={
                <PermissionRoute permission="READ_USERS">
                  <UserList />
                </PermissionRoute>
              } 
            />
            <Route 
              path="/users/new" 
              element={
                <PermissionRoute permission="CREATE_USERS">
                  <UserForm />
                </PermissionRoute>
              } 
            />
            <Route 
              path="/users/edit/:id" 
              element={
                <PermissionRoute permission="UPDATE_USERS">
                  <UserForm />
                </PermissionRoute>
              } 
            />
            
            {/* Role Routes - Require permissions */}
            <Route 
              path="/roles" 
              element={
                <PermissionRoute permission="READ_ROLES">
                  <RoleList />
                </PermissionRoute>
              } 
            />
            <Route 
              path="/roles/new" 
              element={
                <PermissionRoute permission="CREATE_ROLES">
                  <RoleForm />
                </PermissionRoute>
              } 
            />
            <Route 
              path="/roles/edit/:id" 
              element={
                <PermissionRoute permission="UPDATE_ROLES">
                  <RoleForm />
                </PermissionRoute>
              } 
            />
            
            {/* Patient Routes - Require permissions */}
            <Route 
              path="/patients" 
              element={
                <PermissionRoute permission="READ_PATIENTS">
                  <PatientList />
                </PermissionRoute>
              } 
            />
            <Route 
              path="/patients/new" 
              element={
                <PermissionRoute permission="CREATE_PATIENTS">
                  <PatientForm />
                </PermissionRoute>
              } 
            />
            <Route 
              path="/patients/edit/:id" 
              element={
                <PermissionRoute permission="UPDATE_PATIENTS">
                  <PatientForm />
                </PermissionRoute>
              } 
            />
            
            {/* Assessment Routes - Require permissions */}
            <Route 
              path="/assessments" 
              element={
                <PermissionRoute permission="READ_ASSESSMENTS">
                  <AssessmentList />
                </PermissionRoute>
              } 
            />
            <Route 
              path="/assessments/new" 
              element={
                <PermissionRoute permission="CREATE_ASSESSMENTS">
                  <AssessmentForm />
                </PermissionRoute>
              } 
            />
            <Route 
              path="/assessments/edit/:id" 
              element={
                <PermissionRoute permission="UPDATE_ASSESSMENTS">
                  <AssessmentForm />
                </PermissionRoute>
              } 
            />
            <Route 
              path="/assessments/:id" 
              element={
                <PermissionRoute permission="READ_ASSESSMENTS">
                  <AssessmentDetail />
                </PermissionRoute>
              } 
            />
            <Route 
              path="/assessments/:id/take" 
              element={
                <PermissionRoute permission="CREATE_RESPONSES">
                  <AssessmentTake />
                </PermissionRoute>
              } 
            />
            
            {/* Legacy Psychologist Routes */}
            <Route path="/psychologists" element={<PsychologistList />} />
            <Route path="/psychologists/new" element={<PsychologistForm />} />
            <Route path="/psychologists/edit/:id" element={<PsychologistForm />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
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

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="nav-container">
            <button className="menu-toggle" onClick={toggleSidebar}>
              ☰
            </button>
            <Link to="/" className="nav-logo">
              🧠 AssessAssist
            </Link>
          </div>
        </nav>

        <div className="app-container">
          <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
            <nav className="sidebar-nav">
              <Link to="/" className="sidebar-link">
                <span className="sidebar-icon">📊</span>
                <span className="sidebar-text">Dashboard</span>
              </Link>
              <Link to="/users" className="sidebar-link">
                <span className="sidebar-icon">👥</span>
                <span className="sidebar-text">Users</span>
              </Link>
              <Link to="/roles" className="sidebar-link">
                <span className="sidebar-icon">�</span>
                <span className="sidebar-text">Roles</span>
              </Link>
              <Link to="/permissions" className="sidebar-link">
                <span className="sidebar-icon">�</span>
                <span className="sidebar-text">Permissions</span>
              </Link>
              <Link to="/assessments" className="sidebar-link">
                <span className="sidebar-icon">📋</span>
                <span className="sidebar-text">Assessments</span>
              </Link>
            </nav>
          </aside>

          <main className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              
              {/* User Routes */}
              <Route path="/users" element={<UserList />} />
              <Route path="/users/new" element={<UserForm />} />
              <Route path="/users/edit/:id" element={<UserForm />} />
              
              {/* Role Routes */}
              <Route path="/roles" element={<RoleList />} />
              <Route path="/roles/new" element={<RoleForm />} />
              <Route path="/roles/edit/:id" element={<RoleForm />} />
              
              {/* Permission Routes */}
              <Route path="/permissions" element={<PermissionList />} />
              <Route path="/permissions/new" element={<PermissionForm />} />
              <Route path="/permissions/edit/:id" element={<PermissionForm />} />
              
              {/* Psychologist Routes (Legacy) */}
              <Route path="/psychologists" element={<PsychologistList />} />
              <Route path="/psychologists/new" element={<PsychologistForm />} />
              <Route path="/psychologists/edit/:id" element={<PsychologistForm />} />
              
              {/* Patient Routes (Legacy) */}
              <Route path="/patients" element={<PatientList />} />
              <Route path="/patients/new" element={<PatientForm />} />
              <Route path="/patients/edit/:id" element={<PatientForm />} />
              
              {/* Assessment Routes */}
              <Route path="/assessments" element={<AssessmentList />} />
              <Route path="/assessments/new" element={<AssessmentForm />} />
              <Route path="/assessments/edit/:id" element={<AssessmentForm />} />
              <Route path="/assessments/:id" element={<AssessmentDetail />} />
              <Route path="/assessments/:id/take" element={<AssessmentTake />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;

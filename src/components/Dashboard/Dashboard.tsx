import React, { useEffect, useState } from 'react';
import { psychologistAPI, patientAPI, assessmentAPI } from '../../services/api';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    psychologists: 0,
    patients: 0,
    assessments: 0,
    completedAssessments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [psychologistsRes, patientsRes, assessmentsRes] = await Promise.all([
        psychologistAPI.getAll(),
        patientAPI.getAll(),
        assessmentAPI.getAll(),
      ]);

      const completedAssessments = assessmentsRes.data.filter(
        (a: any) => a.status === 'completed'
      ).length;

      setStats({
        psychologists: psychologistsRes.data.length,
        patients: patientsRes.data.length,
        assessments: assessmentsRes.data.length,
        completedAssessments,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
      </div>

      <div className="grid grid-2">
        <div className="stats-card">
          <div className="stats-card-value">{stats.psychologists}</div>
          <div className="stats-card-label">Psychologists</div>
        </div>

        <div className="stats-card">
          <div className="stats-card-value">{stats.patients}</div>
          <div className="stats-card-label">Patients</div>
        </div>

        <div className="stats-card">
          <div className="stats-card-value">{stats.assessments}</div>
          <div className="stats-card-label">Total Assessments</div>
        </div>

        <div className="stats-card">
          <div className="stats-card-value">{stats.completedAssessments}</div>
          <div className="stats-card-label">Completed Assessments</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Welcome to AssessAssist</h2>
        <p style={{ color: '#718096', lineHeight: '1.6' }}>
          Your comprehensive psychology assessment management system. Use the navigation above to manage
          psychologists, patients, and assessments. Create detailed assessments with various question types
          including multiple choice, ratings, and descriptive questions.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { assessmentAPI, patientAPI, psychologistAPI } from '../../services/api';
import { Assessment, Patient, Psychologist } from '../../types';

const AssessmentList: React.FC = () => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [psychologists, setPsychologists] = useState<Psychologist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [assessmentsRes, patientsRes, psychologistsRes] = await Promise.all([
        assessmentAPI.getAll(),
        patientAPI.getAll(),
        psychologistAPI.getAll(),
      ]);
      setAssessments(assessmentsRes.data);
      setPatients(patientsRes.data);
      setPsychologists(psychologistsRes.data);
      setError(null);
    } catch (err) {
      setError('Failed to load assessments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this assessment?')) {
      return;
    }

    try {
      await assessmentAPI.delete(id);
      loadData();
    } catch (err) {
      alert('Failed to delete assessment');
      console.error(err);
    }
  };

  const getPatientName = (patientId: number) => {
    const patient = patients.find((p) => p.id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown';
  };

  const getPsychologistName = (psychologistId: number) => {
    const psychologist = psychologists.find((p) => p.id === psychologistId);
    return psychologist
      ? `${psychologist.firstName} ${psychologist.lastName}`
      : 'Unknown';
  };

  if (loading) return <div className="loading">Loading assessments...</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Assessments</h1>
        <Link to="/assessments/new" className="btn btn-primary">
          + Create Assessment
        </Link>
      </div>

      {error && <div className="error">{error}</div>}

      {assessments.length === 0 ? (
        <div className="empty-state">
          <h3>No assessments found</h3>
          <p>Get started by creating your first assessment</p>
        </div>
      ) : (
        <div className="table">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Patient</th>
                <th>Psychologist</th>
                <th>Scheduled Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assessments.map((assessment) => (
                <tr key={assessment.id}>
                  <td>
                    <Link
                      to={`/assessments/${assessment.id}`}
                      style={{ color: '#667eea', textDecoration: 'none', fontWeight: 600 }}
                    >
                      {assessment.title}
                    </Link>
                  </td>
                  <td>{assessment.assessmentType}</td>
                  <td>{getPatientName(assessment.patientId)}</td>
                  <td>{getPsychologistName(assessment.psychologistId)}</td>
                  <td>{new Date(assessment.scheduledDate).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge status-${assessment.status}`}>
                      {assessment.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <Link
                        to={`/assessments/${assessment.id}`}
                        className="btn btn-secondary"
                        style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                      >
                        View
                      </Link>
                      <Link
                        to={`/assessments/${assessment.id}/take`}
                        className="btn btn-success"
                        style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                      >
                        Take
                      </Link>
                      <button
                        onClick={() => handleDelete(assessment.id!)}
                        className="btn btn-danger"
                        style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AssessmentList;

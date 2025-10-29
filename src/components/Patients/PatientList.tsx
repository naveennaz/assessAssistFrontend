import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { patientAPI, psychologistAPI } from '../../services/api';
import { Patient, Psychologist } from '../../types';

const PatientList: React.FC = () => {
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
      const [patientsRes, psychologistsRes] = await Promise.all([
        patientAPI.getAll(),
        psychologistAPI.getAll(),
      ]);
      setPatients(patientsRes.data);
      setPsychologists(psychologistsRes.data);
      setError(null);
    } catch (err) {
      setError('Failed to load patients');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this patient?')) {
      return;
    }

    try {
      await patientAPI.delete(id);
      loadData();
    } catch (err) {
      alert('Failed to delete patient');
      console.error(err);
    }
  };

  const getPsychologistName = (psychologistId: number) => {
    const psychologist = psychologists.find((p) => p.id === psychologistId);
    return psychologist
      ? `${psychologist.firstName} ${psychologist.lastName}`
      : 'Unknown';
  };

  if (loading) return <div className="loading">Loading patients...</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Patients</h1>
        <Link to="/patients/new" className="btn btn-primary">
          + Add Patient
        </Link>
      </div>

      {error && <div className="error">{error}</div>}

      {patients.length === 0 ? (
        <div className="empty-state">
          <h3>No patients found</h3>
          <p>Get started by adding your first patient</p>
        </div>
      ) : (
        <div className="table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Date of Birth</th>
                <th>Gender</th>
                <th>Psychologist</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id}>
                  <td>{`${patient.firstName} ${patient.lastName}`}</td>
                  <td>{patient.email || '-'}</td>
                  <td>{patient.phone || '-'}</td>
                  <td>{new Date(patient.dateOfBirth).toLocaleDateString()}</td>
                  <td style={{ textTransform: 'capitalize' }}>{patient.gender.replace('_', ' ')}</td>
                  <td>{getPsychologistName(patient.psychologistId)}</td>
                  <td>
                    <div className="table-actions">
                      <Link
                        to={`/patients/edit/${patient.id}`}
                        className="btn btn-secondary"
                        style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(patient.id!)}
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

export default PatientList;

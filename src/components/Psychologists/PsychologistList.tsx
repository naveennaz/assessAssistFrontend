import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { psychologistAPI } from '../../services/api';
import { Psychologist } from '../../types';

const PsychologistList: React.FC = () => {
  const [psychologists, setPsychologists] = useState<Psychologist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPsychologists();
  }, []);

  const loadPsychologists = async () => {
    try {
      setLoading(true);
      const response = await psychologistAPI.getAll();
      setPsychologists(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load psychologists');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this psychologist?')) {
      return;
    }

    try {
      await psychologistAPI.delete(id);
      loadPsychologists();
    } catch (err) {
      alert('Failed to delete psychologist');
      console.error(err);
    }
  };

  if (loading) return <div className="loading">Loading psychologists...</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Psychologists</h1>
        <Link to="/psychologists/new" className="btn btn-primary">
          + Add Psychologist
        </Link>
      </div>

      {error && <div className="error">{error}</div>}

      {psychologists.length === 0 ? (
        <div className="empty-state">
          <h3>No psychologists found</h3>
          <p>Get started by adding your first psychologist</p>
        </div>
      ) : (
        <div className="table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>License Number</th>
                <th>Specialization</th>
                <th>Clinic</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {psychologists.map((psychologist) => (
                <tr key={psychologist.id}>
                  <td>{`${psychologist.firstName} ${psychologist.lastName}`}</td>
                  <td>{psychologist.email}</td>
                  <td>{psychologist.licenseNumber}</td>
                  <td>{psychologist.specialization || '-'}</td>
                  <td>{psychologist.clinicName || '-'}</td>
                  <td>
                    <div className="table-actions">
                      <Link
                        to={`/psychologists/edit/${psychologist.id}`}
                        className="btn btn-secondary"
                        style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(psychologist.id!)}
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

export default PsychologistList;

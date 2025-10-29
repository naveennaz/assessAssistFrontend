import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { patientAPI, psychologistAPI } from '../../services/api';
import { Patient, Psychologist } from '../../types';

const PatientForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [psychologists, setPsychologists] = useState<Psychologist[]>([]);
  const [formData, setFormData] = useState<Patient>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'prefer_not_to_say',
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
    medicalHistory: '',
    psychologistId: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPsychologists();
    if (isEdit && id) {
      loadPatient(parseInt(id));
    }
  }, [id, isEdit]);

  const loadPsychologists = async () => {
    try {
      const response = await psychologistAPI.getAll();
      setPsychologists(response.data);
    } catch (err) {
      console.error('Failed to load psychologists:', err);
    }
  };

  const loadPatient = async (patientId: number) => {
    try {
      const response = await patientAPI.getById(patientId);
      setFormData(response.data);
    } catch (err) {
      setError('Failed to load patient');
      console.error(err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const value = e.target.name === 'psychologistId' ? parseInt(e.target.value) : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEdit && id) {
        await patientAPI.update(parseInt(id), formData);
      } else {
        await patientAPI.create(formData);
      }
      navigate('/patients');
    } catch (err) {
      setError(`Failed to ${isEdit ? 'update' : 'create'} patient`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">{isEdit ? 'Edit Patient' : 'Add New Patient'}</h1>
      </div>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit} className="form">
        <div className="grid grid-2">
          <div className="form-group">
            <label className="form-label">First Name *</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Last Name *</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Date of Birth *</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth?.split('T')[0]}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Gender *</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Psychologist *</label>
            <select
              name="psychologistId"
              value={formData.psychologistId}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Select Psychologist</option>
              {psychologists.map((psychologist) => (
                <option key={psychologist.id} value={psychologist.id}>
                  {`${psychologist.firstName} ${psychologist.lastName}`}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Emergency Contact</label>
            <input
              type="text"
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Emergency Phone</label>
            <input
              type="tel"
              name="emergencyPhone"
              value={formData.emergencyPhone}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="form-textarea"
            rows={3}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Medical History</label>
          <textarea
            name="medicalHistory"
            value={formData.medicalHistory}
            onChange={handleChange}
            className="form-textarea"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/patients')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientForm;

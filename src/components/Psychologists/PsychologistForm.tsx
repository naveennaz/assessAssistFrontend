import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { psychologistAPI } from '../../services/api';
import { Psychologist } from '../../types';

const PsychologistForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState<Psychologist>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    licenseNumber: '',
    specialization: '',
    credentials: '',
    clinicName: '',
    clinicAddress: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEdit && id) {
      loadPsychologist(parseInt(id));
    }
  }, [id, isEdit]);

  const loadPsychologist = async (psychologistId: number) => {
    try {
      const response = await psychologistAPI.getById(psychologistId);
      setFormData(response.data);
    } catch (err) {
      setError('Failed to load psychologist');
      console.error(err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEdit && id) {
        await psychologistAPI.update(parseInt(id), formData);
      } else {
        await psychologistAPI.create(formData);
      }
      navigate('/psychologists');
    } catch (err) {
      setError(`Failed to ${isEdit ? 'update' : 'create'} psychologist`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">
          {isEdit ? 'Edit Psychologist' : 'Add New Psychologist'}
        </h1>
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
            <label className="form-label">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              required
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
            <label className="form-label">License Number *</label>
            <input
              type="text"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Specialization</label>
            <input
              type="text"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Credentials</label>
            <input
              type="text"
              name="credentials"
              value={formData.credentials}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g., PhD, PsyD"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Clinic Name</label>
            <input
              type="text"
              name="clinicName"
              value={formData.clinicName}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Clinic Address</label>
          <textarea
            name="clinicAddress"
            value={formData.clinicAddress}
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
            onClick={() => navigate('/psychologists')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default PsychologistForm;

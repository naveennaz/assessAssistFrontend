import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { assessmentAPI, patientAPI, psychologistAPI } from '../../services/api';
import { Assessment, Patient, Psychologist } from '../../types';

const AssessmentForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [patients, setPatients] = useState<Patient[]>([]);
  const [psychologists, setPsychologists] = useState<Psychologist[]>([]);
  const [formData, setFormData] = useState<Assessment>({
    title: '',
    assessmentType: '',
    description: '',
    status: 'scheduled',
    scheduledDate: '',
    chiefComplaint: '',
    psychologistId: 0,
    patientId: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDropdownData();
    if (isEdit && id) {
      loadAssessment(parseInt(id));
    }
  }, [id, isEdit]);

  const loadDropdownData = async () => {
    try {
      const [patientsRes, psychologistsRes] = await Promise.all([
        patientAPI.getAll(),
        psychologistAPI.getAll(),
      ]);
      setPatients(patientsRes.data);
      setPsychologists(psychologistsRes.data);
    } catch (err) {
      console.error('Failed to load dropdown data:', err);
    }
  };

  const loadAssessment = async (assessmentId: number) => {
    try {
      const response = await assessmentAPI.getById(assessmentId);
      setFormData(response.data);
    } catch (err) {
      setError('Failed to load assessment');
      console.error(err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const value =
      e.target.name === 'psychologistId' || e.target.name === 'patientId'
        ? parseInt(e.target.value)
        : e.target.value;
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
        await assessmentAPI.update(parseInt(id), formData);
      } else {
        await assessmentAPI.create(formData);
      }
      navigate('/assessments');
    } catch (err) {
      setError(`Failed to ${isEdit ? 'update' : 'create'} assessment`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">
          {isEdit ? 'Edit Assessment' : 'Create New Assessment'}
        </h1>
      </div>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit} className="form">
        <div className="grid grid-2">
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Assessment Type *</label>
            <input
              type="text"
              name="assessmentType"
              value={formData.assessmentType}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g., Initial Assessment, Follow-up"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Patient *</label>
            <select
              name="patientId"
              value={formData.patientId}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Select Patient</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {`${patient.firstName} ${patient.lastName}`}
                </option>
              ))}
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
            <label className="form-label">Scheduled Date *</label>
            <input
              type="datetime-local"
              name="scheduledDate"
              value={formData.scheduledDate?.substring(0, 16)}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Status *</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="scheduled">Scheduled</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-textarea"
            rows={3}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Chief Complaint</label>
          <textarea
            name="chiefComplaint"
            value={formData.chiefComplaint}
            onChange={handleChange}
            className="form-textarea"
            rows={3}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/assessments')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AssessmentForm;

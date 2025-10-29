import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { userAPI, roleAPI } from '../../services/api';
import { User, Role } from '../../types';

const UserForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [roles, setRoles] = useState<Role[]>([]);
  const [formData, setFormData] = useState<User>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    roleId: 0,
    dateOfBirth: '',
    gender: '',
    address: '',
    licenseNumber: '',
    specialization: '',
    credentials: '',
    clinicName: '',
    clinicAddress: '',
    emergencyContact: '',
    emergencyPhone: '',
    medicalHistory: '',
    assignedPsychologistId: undefined,
    isActive: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRoles();
    if (isEdit && id) {
      loadUser(parseInt(id));
    }
  }, [id, isEdit]);

  const loadRoles = async () => {
    try {
      const response = await roleAPI.getAll();
      setRoles(response.data);
    } catch (err) {
      console.error('Failed to load roles:', err);
    }
  };

  const loadUser = async (userId: number) => {
    try {
      const response = await userAPI.getById(userId);
      setFormData(response.data);
    } catch (err) {
      setError('Failed to load user');
      console.error(err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const value = e.target.name === 'roleId' || e.target.name === 'assignedPsychologistId'
      ? parseInt(e.target.value)
      : e.target.name === 'isActive'
      ? e.target.value === 'true'
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
        await userAPI.update(parseInt(id), formData);
      } else {
        await userAPI.create(formData);
      }
      navigate('/users');
    } catch (err) {
      setError(`Failed to ${isEdit ? 'update' : 'create'} user`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectedRole = roles.find((r) => r.id === formData.roleId);
  const isPsychologist = selectedRole?.name?.toLowerCase().includes('psychologist');
  const isPatient = selectedRole?.name?.toLowerCase().includes('patient');

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">{isEdit ? 'Edit User' : 'Add New User'}</h1>
      </div>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit} className="form">
        <h3 style={{ marginBottom: '1rem' }}>Basic Information</h3>
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

          {!isEdit && (
            <div className="form-group">
              <label className="form-label">Password *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Role *</label>
            <select
              name="roleId"
              value={formData.roleId}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Select Role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Status *</label>
            <select
              name="isActive"
              value={formData.isActive.toString()}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>

        {isPsychologist && (
          <>
            <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Professional Information</h3>
            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">License Number</label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  className="form-input"
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
                rows={3}
              />
            </div>
          </>
        )}

        {isPatient && (
          <>
            <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Patient Information</h3>
            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth?.split('T')[0]}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
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
          </>
        )}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/users')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;

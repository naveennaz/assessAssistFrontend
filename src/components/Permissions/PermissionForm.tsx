import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { permissionAPI } from '../../services/api';
import { Permission } from '../../types';

const PermissionForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState<Permission>({
    name: '',
    resource: '',
    action: '',
    description: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resources = [
    'users',
    'roles',
    'permissions',
    'assessments',
    'questions',
    'responses',
    'patients',
    'psychologists',
  ];

  const actions = ['create', 'read', 'update', 'delete', 'list', 'all'];

  useEffect(() => {
    if (isEdit && id) {
      loadPermission(parseInt(id));
    }
  }, [id, isEdit]);

  const loadPermission = async (permissionId: number) => {
    try {
      const response = await permissionAPI.getById(permissionId);
      setFormData(response.data);
    } catch (err) {
      setError('Failed to load permission');
      console.error(err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
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
        await permissionAPI.update(parseInt(id), formData);
      } else {
        await permissionAPI.create(formData);
      }
      navigate('/permissions');
    } catch (err) {
      setError(`Failed to ${isEdit ? 'update' : 'create'} permission`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">{isEdit ? 'Edit Permission' : 'Add New Permission'}</h1>
      </div>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label className="form-label">Permission Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-input"
            placeholder="e.g., Create Assessment, View Patients"
            required
          />
        </div>

        <div className="grid grid-2">
          <div className="form-group">
            <label className="form-label">Resource *</label>
            <select
              name="resource"
              value={formData.resource}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Select Resource</option>
              {resources.map((resource) => (
                <option key={resource} value={resource}>
                  {resource.charAt(0).toUpperCase() + resource.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Action *</label>
            <select
              name="action"
              value={formData.action}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Select Action</option>
              {actions.map((action) => (
                <option key={action} value={action}>
                  {action.charAt(0).toUpperCase() + action.slice(1)}
                </option>
              ))}
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
            placeholder="Brief description of what this permission allows"
            rows={4}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/permissions')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default PermissionForm;

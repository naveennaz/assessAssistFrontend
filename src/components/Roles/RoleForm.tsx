import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { roleAPI, permissionAPI, rolePermissionAPI } from '../../services/api';
import { Role, Permission } from '../../types';

const RoleForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState<Role>({
    name: '',
    description: '',
  });

  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPermissions();
    if (isEdit && id) {
      loadRole(parseInt(id));
      loadRolePermissions(parseInt(id));
    }
  }, [id, isEdit]);

  const loadPermissions = async () => {
    try {
      const response = await permissionAPI.getAll();
      setPermissions(response.data);
    } catch (err) {
      console.error('Failed to load permissions:', err);
    }
  };

  const loadRole = async (roleId: number) => {
    try {
      const response = await roleAPI.getById(roleId);
      setFormData(response.data);
    } catch (err) {
      setError('Failed to load role');
      console.error(err);
    }
  };

  const loadRolePermissions = async (roleId: number) => {
    try {
      const response = await rolePermissionAPI.getByRole(roleId);
      const permissionIds = response.data.map((rp: any) => rp.permissionId);
      setSelectedPermissions(permissionIds);
    } catch (err) {
      console.error('Failed to load role permissions:', err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePermissionToggle = (permissionId: number) => {
    setSelectedPermissions(prev => {
      if (prev.includes(permissionId)) {
        return prev.filter(id => id !== permissionId);
      } else {
        return [...prev, permissionId];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let roleId: number;
      
      if (isEdit && id) {
        await roleAPI.update(parseInt(id), formData);
        roleId = parseInt(id);
      } else {
        const response = await roleAPI.create(formData);
        roleId = response.data.id;
      }

      // Update permissions
      if (selectedPermissions.length > 0) {
        await rolePermissionAPI.assignPermissions(roleId, selectedPermissions);
      }

      navigate('/roles');
    } catch (err) {
      setError(`Failed to ${isEdit ? 'update' : 'create'} role`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Group permissions by resource
  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.resource]) {
      acc[permission.resource] = [];
    }
    acc[permission.resource].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">{isEdit ? 'Edit Role' : 'Add New Role'}</h1>
      </div>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label className="form-label">Role Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-input"
            placeholder="e.g., Psychologist, Patient, Admin"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-textarea"
            placeholder="Brief description of this role"
            rows={4}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Permissions</label>
          <div className="permissions-container">
            {Object.keys(groupedPermissions).map((resource) => (
              <div key={resource} className="permission-group">
                <h4 className="permission-group-title">
                  {resource.charAt(0).toUpperCase() + resource.slice(1)}
                </h4>
                <div className="permission-checkboxes">
                  {groupedPermissions[resource].map((permission) => (
                    <label key={permission.id} className="permission-checkbox-label">
                      <input
                        type="checkbox"
                        checked={selectedPermissions.includes(permission.id!)}
                        onChange={() => handlePermissionToggle(permission.id!)}
                        className="permission-checkbox"
                      />
                      <span className="permission-name">
                        {permission.name}
                        {permission.description && (
                          <span className="permission-description">
                            {' - ' + permission.description}
                          </span>
                        )}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/roles')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default RoleForm;

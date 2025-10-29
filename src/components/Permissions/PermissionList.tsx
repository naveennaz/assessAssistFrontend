import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { permissionAPI } from '../../services/api';
import { Permission } from '../../types';

const PermissionList: React.FC = () => {
  const navigate = useNavigate();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPermissions();
  }, []);

  const loadPermissions = async () => {
    try {
      setLoading(true);
      const response = await permissionAPI.getAll();
      setPermissions(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load permissions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this permission?')) {
      try {
        await permissionAPI.delete(id);
        loadPermissions();
      } catch (err) {
        alert('Failed to delete permission');
        console.error(err);
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Permissions</h1>
        <button onClick={() => navigate('/permissions/new')} className="btn btn-primary">
          + Add Permission
        </button>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Resource</th>
              <th>Action</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {permissions.map((permission) => (
              <tr key={permission.id}>
                <td>
                  <strong>{permission.name}</strong>
                </td>
                <td>
                  <span className="badge badge-info">{permission.resource}</span>
                </td>
                <td>
                  <span className="badge badge-secondary">{permission.action}</span>
                </td>
                <td>{permission.description || '-'}</td>
                <td>
                  <button
                    onClick={() => navigate(`/permissions/edit/${permission.id}`)}
                    className="btn btn-sm btn-secondary"
                    style={{ marginRight: '0.5rem' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(permission.id!)}
                    className="btn btn-sm btn-danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {permissions.length === 0 && (
          <p style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
            No permissions found. Click "Add Permission" to create one.
          </p>
        )}
      </div>
    </div>
  );
};

export default PermissionList;

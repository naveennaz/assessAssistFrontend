import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { roleAPI } from '../../services/api';
import { Role } from '../../types';

const RoleList: React.FC = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      setLoading(true);
      const response = await roleAPI.getAll();
      setRoles(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load roles');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        await roleAPI.delete(id);
        loadRoles();
      } catch (err) {
        alert('Failed to delete role');
        console.error(err);
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Roles</h1>
        <button onClick={() => navigate('/roles/new')} className="btn btn-primary">
          + Add Role
        </button>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.id}>
                <td>
                  <strong>{role.name}</strong>
                </td>
                <td>{role.description || '-'}</td>
                <td>{new Date(role.createdAt || '').toLocaleDateString()}</td>
                <td>
                  <button
                    onClick={() => navigate(`/roles/edit/${role.id}`)}
                    className="btn btn-sm btn-secondary"
                    style={{ marginRight: '0.5rem' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(role.id!)}
                    className="btn btn-sm btn-danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {roles.length === 0 && (
          <p style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
            No roles found. Click "Add Role" to create one.
          </p>
        )}
      </div>
    </div>
  );
};

export default RoleList;

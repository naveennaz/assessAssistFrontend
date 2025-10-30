import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { userAPI, roleAPI } from '../../services/api';
import { User, Role } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import PermissionGuard from '../Auth/PermissionGuard';

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterRole, setFilterRole] = useState<number | null>(null);
  const { hasPermission } = useAuth();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersRes, rolesRes] = await Promise.all([
        userAPI.getAll(),
        roleAPI.getAll(),
      ]);
      setUsers(usersRes.data);
      setRoles(rolesRes.data);
      setError(null);
    } catch (err) {
      setError('Failed to load users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await userAPI.delete(id);
      loadData();
    } catch (err) {
      alert('Failed to delete user');
      console.error(err);
    }
  };

  const getRoleName = (roleId: number) => {
    const role = roles.find((r) => r.id === roleId);
    return role ? role.name : 'Unknown';
  };

  const filteredUsers = filterRole
    ? users.filter((u) => u.roleId === filterRole)
    : users;

  if (loading) return <div className="loading">Loading users...</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Users</h1>
        <PermissionGuard permission="CREATE_USERS">
          <Link to="/users/new" className="btn btn-primary">
            + Add User
          </Link>
        </PermissionGuard>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <label style={{ fontWeight: 600 }}>Filter by Role:</label>
          <select
            value={filterRole || ''}
            onChange={(e) => setFilterRole(e.target.value ? parseInt(e.target.value) : null)}
            className="form-select"
            style={{ width: '200px' }}
          >
            <option value="">All Roles</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="empty-state">
          <h3>No users found</h3>
          <p>Get started by adding your first user</p>
        </div>
      ) : (
        <div className="table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{`${user.firstName} ${user.lastName}`}</td>
                  <td>{user.email}</td>
                  <td>{user.phone || '-'}</td>
                  <td>
                    <span className="status-badge status-in_progress">
                      {getRoleName(user.roleId)}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${user.isActive ? 'status-completed' : 'status-cancelled'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <PermissionGuard permission="UPDATE_USERS">
                        <Link
                          to={`/users/edit/${user.id}`}
                          className="btn btn-secondary"
                          style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                        >
                          Edit
                        </Link>
                      </PermissionGuard>
                      <PermissionGuard permission="DELETE_USERS">
                        <button
                          onClick={() => handleDelete(user.id!)}
                          className="btn btn-danger"
                          style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                        >
                          Delete
                        </button>
                      </PermissionGuard>
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

export default UserList;

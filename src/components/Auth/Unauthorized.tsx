import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized: React.FC = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '400px',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <div style={{
        fontSize: '4rem',
        marginBottom: '1rem'
      }}>
        🔒
      </div>
      <h1 style={{
        fontSize: '2rem',
        marginBottom: '1rem',
        color: '#333'
      }}>
        Access Denied
      </h1>
      <p style={{
        fontSize: '1.1rem',
        color: '#666',
        marginBottom: '2rem',
        maxWidth: '500px'
      }}>
        You don't have permission to access this page. Please contact your administrator if you believe this is an error.
      </p>
      <Link to="/" className="btn btn-primary">
        Go to Dashboard
      </Link>
    </div>
  );
};

export default Unauthorized;

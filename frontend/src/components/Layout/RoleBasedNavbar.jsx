import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const RoleBasedNavbar = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    navigate('/');
  };

  // Admin Navigation
  if (userRole === 'admin') {
    return (
      <nav className="navbar">
        <div className="dashboard-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="nav-brand">
              <h2 style={{ color: '#667eea', margin: 0 }}>Admin Dashboard</h2>
              <span style={{ marginLeft: '1rem', color: '#666', fontSize: '0.9rem' }}>
                Welcome, {username}
              </span>
            </div>
            <ul className="nav-links">
              <li>
                <NavLink 
                  to="/admin" 
                  className={({ isActive }) => isActive ? 'active' : ''}
                >
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/admin/complaints"
                  className={({ isActive }) => isActive ? 'active' : ''}
                >
                  All Complaints
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/admin/users"
                  className={({ isActive }) => isActive ? 'active' : ''}
                >
                  Users
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/dashboard"
                  className={({ isActive }) => isActive ? 'active' : ''}
                >
                  User Portal
                </NavLink>
              </li>
              <li>
                <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', width: 'auto' }}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }

  // User Navigation
  return (
    <nav className="navbar">
      <div className="dashboard-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="nav-brand">
            <h2 style={{ color: '#667eea', margin: 0 }}>Grievance Portal</h2>
            <span style={{ marginLeft: '1rem', color: '#666', fontSize: '0.9rem' }}>
              Welcome, {username}
            </span>
          </div>
          <ul className="nav-links">
            <li>
              <NavLink 
                to="/dashboard" 
                className={({ isActive }) => isActive ? 'active' : ''}
              >
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/complaint-history" 
                className={({ isActive }) => isActive ? 'active' : ''}
              >
                My Complaints
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/complaint-form"
                className={({ isActive }) => isActive ? 'active' : ''}
              >
                New Complaint
              </NavLink>
            </li>
            <li>
              <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', width: 'auto' }}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default RoleBasedNavbar;

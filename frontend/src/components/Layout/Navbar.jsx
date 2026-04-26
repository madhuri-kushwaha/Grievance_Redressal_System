import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="dashboard-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="nav-brand">
            <h2 style={{ color: '#667eea', margin: 0 }}>Complaint Portal</h2>
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
                Complaints
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
              <NavLink 
                to="/admin"
                className={({ isActive }) => isActive ? 'active' : ''}
              >
                Admin
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

export default Navbar;
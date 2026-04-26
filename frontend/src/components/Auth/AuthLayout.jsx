import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="auth-container">
      <div className="card">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
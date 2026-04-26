import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginChoice from './components/Auth/LoginChoice';
import AdminLogin from './components/Auth/AdminLogin';
import ForgotPassword from './components/Auth/ForgotPassword';
import Register from './components/Auth/Register';
import ProtectedRoute from './components/ProtectedRoute';
import UserDashboard from './components/Dashboard/UserDashboard';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import ComplaintForm from './components/Dashboard/ComplaintForm';
import ComplaintHistory from './components/Dashboard/ComplaintHistory';
import TrackTicket from './components/Dashboard/TrackTicket';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginChoice />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/complaint-form" element={
            <ProtectedRoute>
              <ComplaintForm />
            </ProtectedRoute>
          } />
          
          <Route path="/complaint-history" element={
            <ProtectedRoute>
              <ComplaintHistory />
            </ProtectedRoute>
          } />
          
          <Route path="/track-ticket" element={
            <ProtectedRoute>
              <TrackTicket />
            </ProtectedRoute>
          } />
          
          <Route path="/admin" element={<AdminDashboard />} />
          
          {/* Fallback */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
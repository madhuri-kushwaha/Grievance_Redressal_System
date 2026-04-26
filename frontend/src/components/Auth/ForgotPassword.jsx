import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, updatePassword } from '../../services/api';

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validation
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      // Call the password update API
      const res = await updatePassword(formData.email, formData.newPassword);
      
      if (res.message) {
        // Password updated successfully
        setSuccess("Password has been reset successfully! Please login with your new password.");
        
        // Clear form
        setFormData({
          email: "",
          newPassword: "",
          confirmPassword: ""
        });
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError("Failed to update password. Please try again.");
      }
    } catch (error) {
      // Handle API errors
      if (error.message && error.message.includes("User not found")) {
        setError("Email not found. Please check your email address.");
      } else {
        setError("An error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 style={{ color: '#667eea', textAlign: 'center', marginBottom: '2rem' }}>
          Reset Password
        </h2>

        {error && <div style={{ color: "red", marginBottom: "1rem", textAlign: 'center' }}>{error}</div>}
        {success && <div style={{ color: "green", marginBottom: "1rem", textAlign: 'center' }}>{success}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{marginBottom: '1rem'}}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 'bold' }}>
              Email Address
            </label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              required
              style={{width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px'}}
            />
          </div>

          <div style={{marginBottom: '1rem'}}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 'bold' }}>
              New Password
            </label>
            <input
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Enter new password"
              required
              minLength="6"
              style={{width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px'}}
            />
          </div>

          <div style={{marginBottom: '1rem'}}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 'bold' }}>
              Confirm New Password
            </label>
            <input
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
              required
              minLength="6"
              style={{width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px'}}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: loading ? '#ccc' : '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '1rem',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <div style={{textAlign: 'center', marginBottom: '1rem'}}>
          <Link to="/login" style={{color: '#667eea', textDecoration: 'none', fontSize: '0.9rem'}}>
            &larr; Back to Login
          </Link>
        </div>

        <div style={{textAlign: 'center', color: '#666', fontSize: '0.9rem'}}>
          Don't have an account? <Link to="/register" style={{color: '#667eea'}}>Register</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

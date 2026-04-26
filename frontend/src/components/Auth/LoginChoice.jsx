import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../../services/api';

const LoginChoice = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await loginUser(formData);
      if (res.access_token) {
        localStorage.setItem("token", res.access_token);
        localStorage.setItem("userId", res.user_id);
        localStorage.setItem("userRole", res.role);
        localStorage.setItem("username", res.username);
        navigate("/dashboard");
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (error) {
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 style={{ color: '#667eea', textAlign: 'center', marginBottom: '2rem' }}>
          Login
        </h2>

        {error && <div style={{ color: "red", marginBottom: "1rem", textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{marginBottom: '1rem'}}>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
              style={{width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px'}}
            />
          </div>

          <div style={{marginBottom: '1rem'}}>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
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
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div style={{textAlign: 'center', marginBottom: '1rem'}}>
          <Link to="/forgot-password" style={{color: '#667eea', textDecoration: 'none', fontSize: '0.9rem'}}>Forgot Password?</Link>
        </div>

        <div style={{textAlign: 'center', color: '#666', fontSize: '0.9rem'}}>
          Don't have an account? <Link to="/register" style={{color: '#667eea'}}>Register</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginChoice;

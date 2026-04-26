import React, { useState } from "react";
import { loginUser } from "../../services/api";
import { useNavigate, Link } from "react-router-dom";

const AdminLogin = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

    const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("Attempting admin login with:", data);
      
      // Hardcoded admin credentials check
      if (data.email === 'kushwahamadhuri36@gmail.com' && data.password === '2004') {
        // Simulate admin login response
        const adminResponse = {
          access_token: 'admin_token_' + Date.now(),
          user_id: 1,
          role: 'admin',
          username: 'Admin'
        };
        
        localStorage.setItem("token", adminResponse.access_token);
        localStorage.setItem("userId", adminResponse.user_id);
        localStorage.setItem("userRole", adminResponse.role);
        localStorage.setItem("username", adminResponse.username);
        console.log("Admin login successful, redirecting to admin dashboard");
        navigate("/admin");
      } else {
        setError("Invalid admin credentials. Only authorized admin can login.");
        console.log("Login failed: Invalid credentials");
      }
    } catch (error) {
      setError("Server error. Please try again later.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh', 
      backgroundColor: '#f8f9fa',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div className="card" style={{ 
        maxWidth: '400px', 
        width: '100%', 
        padding: '2.5rem',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        margin: '1rem'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ 
            color: '#333', 
            fontSize: '1.8rem',
            fontWeight: '600'
          }}>
            Admin Login
          </h2>
        </div>

        {error && <div style={{ 
          color: "#dc3545", 
          marginBottom: "1rem", 
          textAlign: 'center',
          padding: '0.75rem',
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          fontSize: '0.9rem'
        }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{marginBottom: '1.5rem'}}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              color: '#333', 
              fontWeight: '500',
              fontSize: '0.9rem'
            }}>
              Email
            </label>
            <input
              name="email"
              type="email"
              value={data.email}
              onChange={handleChange}
              placeholder="admin@example.com"
              required
              style={{
                width: '100%', 
                padding: '0.75rem 1rem', 
                border: '1px solid #ddd', 
                borderRadius: '4px',
                fontSize: '0.95rem',
                transition: 'border-color 0.3s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#007bff'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
          </div>

          <div style={{marginBottom: '1.5rem'}}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              color: '#333', 
              fontWeight: '500',
              fontSize: '0.9rem'
            }}>
              Password
            </label>
            <input
              name="password"
              type="password"
              value={data.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              style={{
                width: '100%', 
                padding: '0.75rem 1rem', 
                border: '1px solid #ddd', 
                borderRadius: '4px',
                fontSize: '0.95rem',
                transition: 'border-color 0.3s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#007bff'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
          </div>

          <div style={{marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <label style={{display: 'flex', alignItems: 'center', cursor: 'pointer'}}>
              <input type="checkbox" style={{marginRight: '0.5rem'}} />
              <span style={{fontSize: '0.9rem', color: '#666'}}>Remember me</span>
            </label>
            <a href="#" style={{color: '#007bff', textDecoration: 'none', fontSize: '0.9rem'}}>
              Forgot password?
            </a>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.875rem',
              background: loading ? '#6c757d' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '1.5rem',
              fontSize: '1rem',
              fontWeight: '500',
              transition: 'background-color 0.3s'
            }}
            onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#0056b3')}
            onMouseOut={(e) => !loading && (e.target.style.backgroundColor = '#007bff')}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

              </div>
    </div>
  );
};

export default AdminLogin;

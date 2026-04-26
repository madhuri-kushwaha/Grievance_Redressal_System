import React, { useState } from "react";
import { registerUser } from "../../services/api";
import { useNavigate, Link } from "react-router-dom";

const AdminRegister = () => {
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match!");
      return false;
    }
    if (data.password.length < 6) {
      setError("Password must be at least 6 characters long!");
      return false;
    }
    if (!data.email.includes('@')) {
      setError("Please enter a valid email address!");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      console.log("Attempting admin registration with:", { ...data, confirmPassword: "***" });
      
      const res = await registerUser({
        username: data.username,
        email: data.email,
        password: data.password,
        phone: "0000000000", // Default phone for admin
      });
      
      console.log("Registration response:", res);

      if (res.msg === "Registered") {
        setSuccess("Admin registration successful! Please login.");
        setTimeout(() => {
          navigate("/admin-login");
        }, 2000);
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (error) {
      if (error.message && error.message.includes("Email already registered")) {
        setError("This email is already registered. Please use a different email.");
      } else {
        setError("Server error. Please try again later.");
      }
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="card" style={{ maxWidth: '450px' }}>
        <h2 style={{ color: '#dc3545', textAlign: 'center', marginBottom: '2rem' }}>
          Admin Registration
        </h2>

        {error && <div style={{ color: "red", marginBottom: "1rem", textAlign: 'center', padding: '0.75rem', backgroundColor: '#f8d7da', borderRadius: '6px' }}>{error}</div>}
        {success && <div style={{ color: "white", marginBottom: "1rem", textAlign: 'center', padding: '0.75rem', backgroundColor: '#28a745', borderRadius: '6px' }}>{success}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{marginBottom: '1rem'}}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 'bold' }}>
              Admin Name
            </label>
            <input
              name="username"
              type="text"
              value={data.username}
              onChange={handleChange}
              placeholder="Enter admin name"
              required
              style={{width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px'}}
            />
          </div>

          <div style={{marginBottom: '1rem'}}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 'bold' }}>
              Admin Email
            </label>
            <input
              name="email"
              type="email"
              value={data.email}
              onChange={handleChange}
              placeholder="Enter admin email"
              required
              style={{width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px'}}
            />
          </div>

          <div style={{marginBottom: '1rem'}} className="password-box">
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 'bold' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={data.password}
                onChange={handleChange}
                placeholder="Enter password (min 6 characters)"
                required
                style={{width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', paddingRight: '3rem'}}
              />
              <span 
                onClick={() => setShowPassword(!showPassword)}
                style={{position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#666'}}
              >
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>
          </div>

          <div style={{marginBottom: '1.5rem'}} className="password-box">
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 'bold' }}>
              Confirm Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={data.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                required
                style={{width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', paddingRight: '3rem'}}
              />
              <span 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#666'}}
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </span>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: loading ? '#ccc' : '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '1rem',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            {loading ? "Registering..." : "Register as Admin"}
          </button>
        </form>

        <div style={{textAlign: 'center', marginBottom: '1rem'}}>
          <Link to="/admin-login" style={{color: '#dc3545', textDecoration: 'none', fontSize: '0.9rem'}}>
            Already have admin account? Login here
          </Link>
        </div>

        <div style={{textAlign: 'center', marginBottom: '1rem'}}>
          <Link to="/" style={{color: '#667eea', textDecoration: 'none', fontSize: '0.9rem'}}>
            &larr; Back to Login Choice
          </Link>
        </div>

        <p style={{textAlign: 'center', color: '#666', fontSize: '0.9rem', marginTop: '1rem'}}>
          Are you a user? <Link to="/register" style={{color: '#667eea'}}>User Registration</Link>
        </p>
      </div>
    </div>
  );
};

export default AdminRegister;

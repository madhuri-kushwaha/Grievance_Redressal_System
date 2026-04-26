import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../services/api";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

    try {
      const res = await registerUser(formData);

      if (res.msg === "Email already registered") {
        setError("This email is already registered. Please login instead.");
      } else {
        setSuccess("Registration successful! Please login to continue.");
        setTimeout(() => {
          navigate("/"); // redirect to login
        }, 2000);
      }
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="card">
        <h2>Register</h2>

        {error && <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>}
        {success && <div style={{ color: "green", marginBottom: "1rem" }}>{success}</div>}

        <div style={{marginBottom: '1rem'}}>
          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            required
            style={{width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px'}}
          />
        </div>

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
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            required
            style={{width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px'}}
          />
        </div>

        <div style={{marginBottom: '1rem'}} className="password-box">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            style={{width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', paddingRight: '3rem'}}
          />
          <span 
            onClick={() => setShowPassword(!showPassword)}
            style={{position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer'}}
          >
            {showPassword ? "Hide" : "Show"}
          </span>
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
            marginBottom: '1rem'
          }}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p style={{textAlign: 'center'}}>
          Already have an account? <Link to="/user-login" style={{color: '#667eea'}}>Login</Link>
        </p>
        
      </form>
    </div>
  );
};

export default Register;
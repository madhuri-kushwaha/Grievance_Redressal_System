import React, { useState } from "react";
import { loginUser } from "../../services/api";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
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
      console.log("Attempting login with:", data);
      const res = await loginUser(data);
      console.log("Login response:", res);

      if (res.access_token) {
        localStorage.setItem("token", res.access_token);
        localStorage.setItem("userId", res.user_id);
        localStorage.setItem("userRole", res.role);
        localStorage.setItem("username", res.username);
        console.log("Login successful, role:", res.role);
        
        // Role-based redirect
        if (res.role === 'admin') {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      } else {
        setError("Invalid credentials. Please try again.");
        console.log("Login failed: No access token");
      }
    } catch (error) {
      setError("Server error. Please try again later.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="card">
        <h2>Login</h2>

        {error && <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>}

        <div style={{marginBottom: '1rem'}}>
          <input
            name="email"
            type="email"
            value={data.email}
            onChange={handleChange}
            placeholder="Email"
            required
            style={{width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px'}}
          />
        </div>

        <div style={{marginBottom: '1rem'}} className="password-box">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            value={data.password}
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

        <div style={{marginBottom: '1rem'}}>
          <label style={{display: 'flex', alignItems: 'center'}}>
            <input type="checkbox" style={{marginRight: '0.5rem'}} />
            Remember me
          </label>
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
          {loading ? "Logging in..." : "Login"}
        </button>

        <div style={{textAlign: 'center', marginBottom: '1rem'}}>
          <a href="#" style={{color: '#667eea', textDecoration: 'none'}}>Forgot Password?</a>
        </div>

        <p style={{textAlign: 'center'}}>
          Don't have an account? <Link to="/register" style={{color: '#667eea'}}>Register</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
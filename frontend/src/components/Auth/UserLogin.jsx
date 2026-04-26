import React, { useState } from "react";
import { loginUser } from "../../services/api";
import { useNavigate, Link } from "react-router-dom";

const UserLogin = () => {
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
      console.log("Attempting user login with:", data);
      const res = await loginUser(data);
      console.log("Login response:", res);

      if (res.access_token) {
        localStorage.setItem("token", res.access_token);
        localStorage.setItem("userId", res.user_id);
        localStorage.setItem("userRole", res.role);
        localStorage.setItem("username", res.username);
        console.log("Login successful, redirecting to dashboard");
        navigate("/dashboard");
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
    <div className="auth-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div className="card" style={{ maxWidth: '450px' }}>
        <h2 style={{ color: '#667eea', textAlign: 'center', marginBottom: '2rem' }}>
          Login
        </h2>

        {error && <div style={{ color: "red", marginBottom: "1rem", textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{marginBottom: '1rem'}}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 'bold' }}>
              Email
            </label>
            <input
              name="email"
              type="email"
              value={data.email}
              onChange={handleChange}
              placeholder="Enter your email"
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
                placeholder="Enter your password"
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

          <div style={{marginBottom: '1.5rem'}}>
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
              marginBottom: '1rem',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div style={{textAlign: 'center', marginBottom: '1rem'}}>
          <a href="#" style={{color: '#667eea', textDecoration: 'none', fontSize: '0.9rem'}}>Forgot Password?</a>
        </div>

        
        <p style={{textAlign: 'center', color: '#666', fontSize: '0.9rem'}}>
          Don't have an account? <Link to="/register" style={{color: '#667eea'}}>Register</Link>
        </p>
      </div>
    </div>
  );
};

export default UserLogin;

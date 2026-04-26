import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleAdminLoginClick = () => {
    navigate('/admin-login');
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundImage: 'url("/image1.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative'
    }}>
      <div style={{
        maxWidth: '800px',
        width: '100%',
        padding: '3rem',
        textAlign: 'center',
        position: 'relative',
        zIndex: 2
      }}>

        {/* Logo Section */}
        <div style={{
          fontSize: '4rem',
          fontWeight: 'bold',
          color: 'black',
          marginBottom: '1rem',
          textShadow: '2px 2px 4px rgba(255,255,255,0.8)'
        }}>
          G
        </div>

        {/* Main Title */}
        <h1 style={{
          fontSize: '2.5rem',
          color: 'black',
          marginBottom: '1.5rem',
          fontWeight: 'bold',
          lineHeight: '1.2',
          textShadow: '2px 2px 4px rgba(255,255,255,0.8)'
        }}>
          Welcome to the Digital Grievance Redressal System!
        </h1>

        {/* Description */}
        <div style={{
          fontSize: '1.1rem',
          color: 'black',
          lineHeight: '1.8',
          marginBottom: '2.5rem',
          maxWidth: '600px',
          margin: '0 auto 2.5rem auto',
          textShadow: '1px 1px 2px rgba(255,255,255,0.8)'
        }}>
          <p style={{ margin: '0 0 1rem 0' }}>
            This platform allows you to easily submit your complaints, track their status, and get timely updates. 
            You can register new grievances, view your previous complaints, and monitor their resolution progress.
          </p>
          <p style={{ margin: '0' }}>
            Use the dashboard to manage your activities and ensure your issues are addressed efficiently.
          </p>
        </div>

        {/* Button Container */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          {/* User Login Button */}
          <button
            onClick={handleLoginClick}
            style={{
              padding: '1rem 2.5rem',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              color: 'white',
              backgroundColor: '#007bff',
              border: 'none',
              borderRadius: '50px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(0, 123, 255, 0.3)',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#0056b3';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(0, 123, 255, 0.5)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#007bff';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(0, 123, 255, 0.3)';
            }}
          >
            User Login
          </button>

          {/* Admin Login Button */}
          <button
            onClick={handleAdminLoginClick}
            style={{
              padding: '1rem 2.5rem',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              color: 'white',
              backgroundColor: '#28a745',
              border: 'none',
              borderRadius: '50px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(40, 167, 69, 0.3)',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#218838';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(40, 167, 69, 0.5)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#28a745';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(40, 167, 69, 0.3)';
            }}
          >
            Admin Login
          </button>
        </div>

        {/* Footer Text */}
        <div style={{
          marginTop: '2rem',
          fontSize: '0.9rem',
          color: 'black',
          fontStyle: 'italic',
          textShadow: '1px 1px 2px rgba(255,255,255,0.8)'
        }}>
          Your voice matters - let us help you make it heard
        </div>
      </div>
    </div>
  );
};

export default HomePage;

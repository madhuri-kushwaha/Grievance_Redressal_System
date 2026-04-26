import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createComplaint } from "../../services/api";

const ComplaintForm = () => {
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '',
    category: 'complaint',
    priority: 'medium'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [predictedPriority, setPredictedPriority] = useState('');
  const [ticketId, setTicketId] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    navigate('/');
  };

  const categories = [
    { value: 'complaint', label: 'Complaint' },
    { value: 'query', label: 'Query' },
    { value: 'support', label: 'Support' },
    { value: 'suggestion', label: 'Suggestion' },
    { value: 'other', label: 'Other' }
  ];

  const priorities = [
    { value: 'low', label: 'Low Priority', level: 1 },
    { value: 'medium', label: 'Medium Priority', level: 2 },
    { value: 'high', label: 'High Priority', level: 3 }
  ];

  // AI Priority Prediction (simple keyword-based)
  const predictPriority = (title, description) => {
    const text = (title + ' ' + description).toLowerCase();
    
    if (text.includes('urgent') || text.includes('emergency') || text.includes('critical') || text.includes('immediate')) {
      return 'high';
    } else if (text.includes('important') || text.includes('soon') || text.includes('asap')) {
      return 'medium';
    } else {
      return 'low';
    }
  };

  useEffect(() => {
    if (formData.title || formData.description) {
      const priority = predictPriority(formData.title, formData.description);
      setPredictedPriority(priority);
    }
  }, [formData.title, formData.description]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('User not logged in. Please login again.');
        navigate('/');
        return;
      }

      const response = await createComplaint({
        title: formData.title,
        description: formData.description,
        user_id: parseInt(userId)
      });

      if (response.ticket_id) {
        alert(`Complaint submitted successfully!\nTicket ID: ${response.ticket_id}`);
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Failed to submit complaint. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{padding: '1rem', maxWidth: '1400px', margin: '0 auto', backgroundColor: '#f5f5f5', minHeight: '100vh'}}>
      {/* Welcome Section */}
      <div style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '1.5rem', borderRadius: '8px', color: 'white', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        {/* Left Side - G Logo and Main Heading */}
        <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
          <div style={{fontSize: '3rem', fontWeight: 'bold', color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.3)'}}>
            G
          </div>
          <div>
            <h1 style={{margin: '0', fontSize: '2rem', marginBottom: '0.3rem'}}>Grievance Redressal System</h1>
          </div>
        </div>
        
        {/* Right Side - Navigation Buttons */}
        <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center'}}>
          <button 
            onClick={() => navigate('/dashboard')}
            style={{
              padding: '0.6rem 1.2rem',
              background: 'transparent',
              color: 'white',
              border: '2px solid white',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 'bold',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'white';
              e.target.style.color = '#667eea';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = 'white';
            }}
          >
            Home
          </button>
          
          <button 
            onClick={() => navigate('/complaint-form')}
            style={{
              padding: '0.6rem 1.2rem',
              background: 'transparent',
              color: 'white',
              border: '2px solid white',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 'bold',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'white';
              e.target.style.color = '#007bff';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = 'white';
            }}
          >
            New Complaint
          </button>
          
          <button 
            onClick={() => navigate('/complaint-history')}
            style={{
              padding: '0.6rem 1.2rem',
              background: 'transparent',
              color: 'white',
              border: '2px solid white',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 'bold',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'white';
              e.target.style.color = '#28a745';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = 'white';
            }}
          >
            My Complaints
          </button>
          
          <button 
            onClick={() => navigate('/track-ticket')}
            style={{
              padding: '0.6rem 1.2rem',
              background: 'transparent',
              color: 'white',
              border: '2px solid white',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 'bold',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'white';
              e.target.style.color = '#ffc107';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = 'white';
            }}
          >
            Track Ticket
          </button>
          
          <button 
            onClick={handleLogout}
            style={{
              padding: '0.6rem 1.2rem',
              background: 'transparent',
              color: 'white',
              border: '2px solid white',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 'bold',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#dc3545';
              e.target.style.color = 'white';
              e.target.style.borderColor = '#dc3545';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = 'white';
              e.target.style.borderColor = 'white';
            }}
          >
            Logout
          </button>
        </div>
      </div>
      
      {/* Complaint Form Content */}
      <div style={{background: 'white', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', overflow: 'hidden'}}>
        <div style={{padding: '1.5rem', borderBottom: '1px solid #eee'}}>
          <h2 style={{margin: 0, color: '#333'}}>Submit New Complaint</h2>
        </div>
        
        <div style={{padding: '2rem', maxWidth: '800px', margin: '0 auto'}}>
          {error && <div style={{color: 'red', marginBottom: '1rem', textAlign: 'center'}}>{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div style={{marginBottom: '1.5rem'}}>
              <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555'}}>Title *</label>
              <input 
                name="title" 
                value={formData.title} 
                onChange={handleChange} 
                placeholder="Enter complaint title" 
                required 
                style={{width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '16px'}} 
              />
            </div>

            <div style={{marginBottom: '1.5rem'}}>
              <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555'}}>Description *</label>
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                placeholder="Provide detailed description of your complaint..." 
                required 
                style={{width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '16px', height: '150px', resize: 'vertical'}} 
              />
            </div>

            <div style={{display: 'flex', gap: '1rem', marginTop: '2rem'}}>
              <button 
                type="submit" 
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '1rem',
                  background: loading ? '#ccc' : '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
              >
                {loading ? 'Submitting...' : 'Submit Complaint'}
              </button>
              
              <button 
                type="button"
                onClick={() => navigate('/dashboard')}
                style={{
                  padding: '1rem 2rem',
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ComplaintForm;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserComplaints } from '../../services/api';

const TrackTicket = () => {
  const [ticketId, setTicketId] = useState('');
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    navigate('/');
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!ticketId.trim()) {
      setError('Please enter a ticket ID');
      return;
    }

    setLoading(true);
    setError('');
    setNotFound(false);
    setComplaint(null);

    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('User not logged in. Please login again.');
        navigate('/');
        return;
      }

      const complaints = await getUserComplaints(userId);
      const foundComplaint = complaints.find(c => 
        c.ticket_id && c.ticket_id.toLowerCase() === ticketId.trim().toLowerCase()
      );

      if (foundComplaint) {
        setComplaint(foundComplaint);
      } else {
        setNotFound(true);
      }
    } catch (err) {
      setError('Failed to search for ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return '#fff3cd';
      case 'Resolved': return '#d4edda';
      case 'Rejected': return '#f8d7da';
      case 'In Progress': return '#cce5ff';
      default: return '#f8f9fa';
    }
  };

  const getStatusTextColor = (status) => {
    switch(status) {
      case 'Pending': return '#856404';
      case 'Resolved': return '#155724';
      case 'Rejected': return '#721c24';
      case 'In Progress': return '#004085';
      default: return '#333';
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
      
      {/* Track Ticket Content */}
      <div style={{background: 'white', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', overflow: 'hidden'}}>
        <div style={{padding: '1.5rem', borderBottom: '1px solid #eee'}}>
          <h2 style={{margin: 0, color: '#333'}}>Track Your Ticket</h2>
        </div>
        
        <div style={{padding: '2rem', maxWidth: '800px', margin: '0 auto'}}>
          {/* Search Form */}
          <form onSubmit={handleSearch} style={{marginBottom: '2rem'}}>
            <div style={{display: 'flex', gap: '1rem', alignItems: 'end'}}>
              <div style={{flex: 1}}>
                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555'}}>
                  Enter Ticket ID
                </label>
                <input
                  type="text"
                  value={ticketId}
                  onChange={(e) => setTicketId(e.target.value)}
                  placeholder="e.g., GRS12345"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '16px'
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '0.75rem 2rem',
                  background: loading ? '#ccc' : '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  height: 'fit-content'
                }}
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div style={{color: 'red', marginBottom: '1rem', textAlign: 'center', padding: '1rem', backgroundColor: '#ffebee', borderRadius: '6px'}}>
              {error}
            </div>
          )}

          {/* Not Found Message */}
          {notFound && (
            <div style={{textAlign: 'center', padding: '2rem', backgroundColor: '#f8f9fa', borderRadius: '6px'}}>
              <p style={{fontSize: '1.1rem', color: '#666', marginBottom: '1rem'}}>
                No complaint found with Ticket ID: <strong>{ticketId}</strong>
              </p>
              <p style={{color: '#666'}}>
                Please check the ticket ID and try again, or 
                <button 
                  onClick={() => navigate('/complaint-history')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#007bff',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    padding: '0',
                    margin: '0',
                    fontSize: 'inherit'
                  }}
                >
                  view all your complaints
                </button>
              </p>
            </div>
          )}

          {/* Complaint Details */}
          {complaint && (
            <div style={{border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#f8f9fa'}}>
              <div style={{padding: '1.5rem', borderBottom: '1px solid #eee', backgroundColor: 'white'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                  <div style={{flex: 1}}>
                    <h3 style={{margin: '0 0 0.5rem 0', color: '#333', fontSize: '1.3rem'}}>
                      {complaint.title}
                    </h3>
                    <p style={{margin: '0', color: '#666', fontSize: '0.9rem'}}>
                      <strong>Ticket ID:</strong> {complaint.ticket_id} | 
                      <strong> Date:</strong> {new Date(complaint.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
                                        <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      backgroundColor: getStatusColor(complaint.status),
                      color: getStatusTextColor(complaint.status)
                    }}>
                      {complaint.status}
                    </span>
                  </div>
                </div>
              </div>
              
              <div style={{padding: '1.5rem'}}>
                <div style={{marginBottom: '1.5rem'}}>
                  <h4 style={{margin: '0 0 0.5rem 0', color: '#333'}}>Description</h4>
                  <p style={{margin: 0, color: '#555', lineHeight: '1.5'}}>
                    {complaint.description}
                  </p>
                </div>
                
                {complaint.solution && (
                  <div style={{backgroundColor: '#d4edda', padding: '1rem', borderRadius: '6px', marginTop: '1rem'}}>
                    <h4 style={{margin: '0 0 0.5rem 0', color: '#155724'}}>Solution</h4>
                    <p style={{margin: 0, color: '#155724', lineHeight: '1.5'}}>
                      {complaint.solution}
                    </p>
                  </div>
                )}
                
                <div style={{marginTop: '2rem', textAlign: 'center'}}>
                  <button 
                    onClick={() => {
                      setComplaint(null);
                      setTicketId('');
                    }}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >
                    Track Another Ticket
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackTicket;

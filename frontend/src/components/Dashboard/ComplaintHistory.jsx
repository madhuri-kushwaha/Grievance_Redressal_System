import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserComplaints, deleteComplaint } from '../../services/api';

const ComplaintHistory = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cancelLoading, setCancelLoading] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    navigate('/');
  };

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError('');
      const userId = localStorage.getItem('userId');
      const data = await getUserComplaints(userId);
      setComplaints(data);
    } catch (error) {
      setError('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelComplaint = async (complaintId) => {
    if (!window.confirm('Are you sure you want to delete this complaint? This action cannot be undone.')) {
      return;
    }

    try {
      setCancelLoading(complaintId);
      await deleteComplaint(complaintId);
      
      // Remove complaint from local state
      setComplaints(prevComplaints => 
        prevComplaints.filter(complaint => complaint.id !== complaintId)
      );
      
      alert('Complaint deleted successfully!');
    } catch (error) {
      alert('Failed to delete complaint. Please try again.');
    } finally {
      setCancelLoading(null);
    }
  };

  const canCancelComplaint = (complaint) => {
    return complaint.status !== 'Cancelled' && 
           complaint.status !== 'Resolved' && 
           complaint.status !== 'Rejected';
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{color: 'red'}}>{error}</div>;

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
      
      {/* Complaint History Content */}
      <div style={{background: 'white', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', overflow: 'hidden'}}>
        <div style={{padding: '1.5rem', borderBottom: '1px solid #eee'}}>
          <h2 style={{margin: 0, color: '#333'}}>Complaint History</h2>
        </div>
        
        {complaints.length === 0 ? (
          <div style={{padding: '3rem', textAlign: 'center', color: '#666'}}>
            <p style={{fontSize: '1.1rem', marginBottom: '1rem'}}>No complaints found</p>
            <button 
              onClick={() => navigate('/complaint-form')}
              style={{
                padding: '0.8rem 1.5rem',
                background: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 'bold'
              }}
            >
              Submit Your First Complaint
            </button>
          </div>
        ) : (
          <div style={{padding: '1.5rem'}}>
            {complaints.map(complaint => (
              <div key={complaint.id} style={{border: '1px solid #ddd', padding: '1rem', marginBottom: '1rem', borderRadius: '8px', backgroundColor: '#f8f9fa'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem'}}>
                  <div style={{flex: 1}}>
                    <h3 style={{margin: '0 0 0.5rem 0', color: '#333', fontSize: '1.2rem'}}>{complaint.title}</h3>
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
                      backgroundColor: complaint.status === 'Pending' ? '#fff3cd' : 
                                      complaint.status === 'Resolved' ? '#d4edda' : 
                                      complaint.status === 'Rejected' ? '#f8d7da' : 
                                      complaint.status === 'Cancelled' ? '#e2e3e5' : '#cce5ff',
                      color: complaint.status === 'Pending' ? '#856404' : 
                             complaint.status === 'Resolved' ? '#155724' : 
                             complaint.status === 'Rejected' ? '#721c24' : 
                             complaint.status === 'Cancelled' ? '#383d41' : '#004085'
                    }}>
                      {complaint.status}
                    </span>
                  </div>
                </div>
                
                <p style={{margin: '0 0 1rem 0', color: '#555', lineHeight: '1.5'}}>
                  {complaint.description}
                </p>
                
                {complaint.solution && (
                  <div style={{backgroundColor: '#d4edda', padding: '1rem', borderRadius: '6px', marginTop: '1rem'}}>
                    <p style={{margin: '0', fontWeight: 'bold', color: '#155724'}}>Solution:</p>
                    <p style={{margin: '0.5rem 0 0 0', color: '#155724'}}>{complaint.solution}</p>
                  </div>
                )}
                
                {canCancelComplaint(complaint) && (
                  <div style={{marginTop: '1rem', textAlign: 'right'}}>
                    <button 
                      onClick={() => handleCancelComplaint(complaint.id)}
                      disabled={cancelLoading === complaint.id}
                      style={{
                        padding: '0.5rem 1rem',
                        background: cancelLoading === complaint.id ? '#ccc' : '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: cancelLoading === complaint.id ? 'not-allowed' : 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: 'bold'
                      }}
                    >
                      {cancelLoading === complaint.id ? 'Deleting...' : 'Delete Complaint'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintHistory;
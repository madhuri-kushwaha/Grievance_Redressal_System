import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserComplaints } from '../../services/api';

const UserDashboard = () => {
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0, rejected: 0 });
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    navigate('/');
  };

  const checkForUpdates = (newComplaints, oldComplaints) => {
    const newNotifications = [];
    
    newComplaints.forEach(newComplaint => {
      const oldComplaint = oldComplaints.find(c => c.id === newComplaint.id);
      
      if (oldComplaint && oldComplaint.status !== newComplaint.status) {
        let message = '';
        let type = 'info';
        
        if (newComplaint.status === 'Resolved') {
          message = `Your complaint "${newComplaint.title}" has been resolved!`;
          type = 'success';
        } else if (newComplaint.status === 'In Progress') {
          message = `Your complaint "${newComplaint.title}" is now in progress!`;
          type = 'info';
        } else if (newComplaint.status === 'Rejected') {
          message = `Your complaint "${newComplaint.title}" has been rejected.`;
          type = 'error';
        }
        
        if (message) {
          newNotifications.push({
            id: Date.now() + Math.random(),
            message,
            type,
            timestamp: new Date(),
            complaintId: newComplaint.id,
            ticketId: newComplaint.ticket_id
          });
        }
      }
      
      // Check for new solution
      if (newComplaint.solution && (!oldComplaint || oldComplaint.solution !== newComplaint.solution)) {
        newNotifications.push({
          id: Date.now() + Math.random(),
          message: `Solution provided for your complaint "${newComplaint.title}"`,
          type: 'success',
          timestamp: new Date(),
          complaintId: newComplaint.id,
          ticketId: newComplaint.ticket_id
        });
      }
    });
    
    if (newNotifications.length > 0) {
      setNotifications(prev => [...newNotifications, ...prev].slice(0, 10)); // Keep only last 10
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId');
      
      if (!userId) {
        navigate('/');
        return;
      }
      
      const newComplaints = await getUserComplaints(userId);
      const complaintsArray = newComplaints || [];
      
      // Check for updates
      if (complaints.length > 0) {
        checkForUpdates(complaintsArray, complaints);
      }
      
      setComplaints(complaintsArray);
      
      // Filter out the specific complaint and calculate stats
      const filteredComplaints = complaintsArray.filter(c => c.ticket_id !== 'GRS98194');
      const total = filteredComplaints.length;
      const pending = filteredComplaints.filter(c => c.status === 'Pending').length;
      const resolved = filteredComplaints.filter(c => c.status === 'Resolved').length;
      const rejected = filteredComplaints.filter(c => c.status === 'Rejected').length;
      const inProgress = filteredComplaints.filter(c => c.status === 'In Progress').length;
      
      setStats({ total, pending, resolved, rejected, inProgress });
    } catch (error) {
      console.error('Error:', error);
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Auto-refresh every 30 seconds to check for updates
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

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
      default: return '#6c757d';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority?.toLowerCase()) {
      case 'high': return '#f8d7da';
      case 'medium': return '#fff3cd';
      case 'low': return '#d4edda';
      default: return '#f8f9fa';
    }
  };

  const getPriorityTextColor = (priority) => {
    switch(priority?.toLowerCase()) {
      case 'high': return '#721c24';
      case 'medium': return '#856404';
      case 'low': return '#155724';
      default: return '#6c757d';
    }
  };

  if (loading) return (
    <div style={{padding: '2rem', textAlign: 'center'}}>
      <h2>Loading your dashboard...</h2>
    </div>
  );

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
      
      {/* Notifications */}
      {notifications.length > 0 && (
        <div style={{background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '1.5rem'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
            <h3 style={{margin: 0, color: '#333', fontSize: '1.2rem'}}>
              Recent Updates ({notifications.length})
            </h3>
            <div style={{display: 'flex', gap: '0.5rem'}}>
              <button 
                onClick={fetchDashboardData}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.8rem'
                }}
              >
                Refresh
              </button>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.8rem'
                }}
              >
                {showNotifications ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          
          {showNotifications && (
            <div>
              {notifications.slice(0, 5).map(notification => (
                <div 
                  key={notification.id}
                  style={{
                    padding: '1rem',
                    marginBottom: '0.5rem',
                    borderRadius: '6px',
                    backgroundColor: notification.type === 'success' ? '#d4edda' : 
                                   notification.type === 'error' ? '#f8d7da' : '#cce5ff',
                    border: `1px solid ${notification.type === 'success' ? '#c3e6cb' : 
                                      notification.type === 'error' ? '#f5c6cb' : '#b8daff'}`
                  }}
                >
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start'}}>
                    <div style={{flex: 1}}>
                      <p style={{margin: '0 0 0.5rem 0', color: '#333', fontWeight: 'bold'}}>
                        {notification.message}
                      </p>
                      <p style={{margin: 0, color: '#666', fontSize: '0.8rem'}}>
                        Ticket ID: {notification.ticketId} | 
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <button 
                      onClick={() => navigate(`/track-ticket`)}
                      style={{
                        padding: '0.25rem 0.75rem',
                        background: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.7rem',
                        marginLeft: '1rem'
                      }}
                    >
                      Track
                    </button>
                  </div>
                </div>
              ))}
              
              {notifications.length > 5 && (
                <p style={{margin: '0.5rem 0 0 0', color: '#666', fontSize: '0.8rem', textAlign: 'center'}}>
                  And {notifications.length - 5} more updates...
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Welcome Message */}
      <div style={{background: 'white', padding: '3rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '2rem', textAlign: 'center'}}>
        <h2 style={{margin: '0', fontSize: '2.5rem', color: '#333', marginBottom: '1rem', fontWeight: 'bold'}}>
          Welcome to Grievance Redressal System
        </h2>
        <p style={{margin: '0', fontSize: '1.2rem', color: '#666', lineHeight: '1.6'}}>
          Submit your grievances and track their resolution efficiently.
        </p>
        
        {/* Action Button */}
        <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem'}}>
          <button 
            onClick={() => navigate('/complaint-form')}
            style={{
              padding: '0.8rem 2rem',
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            Submit New Complaint
          </button>
        </div>
      </div>

      {/* Recent Complaints */}
      <div style={{background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
        <h3 style={{margin: '0 0 1.5rem 0', color: '#333', fontSize: '1.5rem'}}>
          Your Recent Complaints
        </h3>
        
        {complaints.length === 0 ? (
          <div style={{textAlign: 'center', padding: '2rem', color: '#666'}}>
            <p style={{fontSize: '1.1rem', marginBottom: '1rem'}}>No complaints found</p>
            <button 
              onClick={() => navigate('/complaint-form')}
              style={{
                padding: '0.8rem 2rem',
                background: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}
            >
              Submit Your First Complaint
            </button>
          </div>
        ) : (
          <div>
            {complaints.slice(0, 5).map(complaint => (
              <div key={complaint.id} style={{
                border: '1px solid #ddd',
                padding: '1.5rem',
                marginBottom: '1rem',
                borderRadius: '8px',
                backgroundColor: '#f8f9fa'
              }}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem'}}>
                  <div style={{flex: 1}}>
                    <h4 style={{margin: '0 0 0.5rem 0', color: '#333', fontSize: '1.1rem'}}>
                      {complaint.title}
                    </h4>
                    <p style={{margin: '0', color: '#666', fontSize: '0.9rem'}}>
                      <strong>Ticket ID:</strong> {complaint.ticket_id} | 
                      <strong> Date:</strong> {new Date(complaint.created_at).toLocaleDateString()}
                    </p>
                  </div>
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
                
                <p style={{margin: '0 0 1rem 0', color: '#555', lineHeight: '1.5'}}>
                  {complaint.description}
                </p>
                
                {complaint.solution && (
                  <div style={{backgroundColor: '#d4edda', padding: '1rem', borderRadius: '6px', marginBottom: '1rem'}}>
                    <p style={{margin: '0', fontWeight: 'bold', color: '#155724'}}>Solution:</p>
                    <p style={{margin: '0.5rem 0 0 0', color: '#155724'}}>{complaint.solution}</p>
                  </div>
                )}
                
                <button 
                  onClick={() => navigate('/track-ticket')}
                  style={{
                    padding: '0.5rem 1rem',
                    background: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.8rem'
                  }}
                >
                  Track Details
                </button>
              </div>
            ))}
            
            {complaints.length > 5 && (
              <div style={{textAlign: 'center', marginTop: '1rem'}}>
                <button 
                  onClick={() => navigate('/complaint-history')}
                  style={{
                    padding: '0.8rem 2rem',
                    background: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: 'bold'
                  }}
                >
                  View All Complaints
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;

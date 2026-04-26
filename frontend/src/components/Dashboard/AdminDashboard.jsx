import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllComplaints, updateComplaint } from '../../services/api';

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [updateLoading, setUpdateLoading] = useState(null);
  const [solutions, setSolutions] = useState({});
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
      const data = await getAllComplaints();
      setComplaints(data);
    } catch (error) {
      console.error('Error loading complaints:', error);
      setError(`Failed to load complaints: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (complaintId, newStatus) => {
    try {
      setUpdateLoading(complaintId);
      await updateComplaint(complaintId, newStatus);
      
      // Update local state
      setComplaints(prevComplaints => 
        prevComplaints.map(complaint => 
          complaint.id === complaintId 
            ? { ...complaint, status: newStatus }
            : complaint
        )
      );
      
      alert('Complaint status updated successfully!');
    } catch (error) {
      alert('Failed to update complaint. Please try again.');
    } finally {
      setUpdateLoading(null);
    }
  };

  const handleSolutionChange = (complaintId, value) => {
    setSolutions(prev => ({
      ...prev,
      [complaintId]: value
    }));
  };

  const handleUpdateSolution = async (complaintId, solution) => {
    try {
      setUpdateLoading(complaintId);
      await updateComplaint(complaintId, 'Resolved', solution);
      
      // Update local state
      setComplaints(prevComplaints => 
        prevComplaints.map(complaint => 
          complaint.id === complaintId 
            ? { ...complaint, status: 'Resolved', solution: solution }
            : complaint
        )
      );
      
      // Clear solution input
      setSolutions(prev => ({
        ...prev,
        [complaintId]: ''
      }));
      
      alert('Complaint resolved successfully!');
    } catch (error) {
      alert('Failed to resolve complaint. Please try again.');
    } finally {
      setUpdateLoading(null);
    }
  };

  useEffect(() => {
    fetchComplaints();
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
      default: return '#333';
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{color: 'red'}}>{error}</div>;

  return (
    <div style={{padding: '1rem', maxWidth: '1400px', margin: '0 auto', backgroundColor: '#f5f5f5', minHeight: '100vh'}}>
      {/* Header */}
      <div style={{background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)', padding: '1.5rem', borderRadius: '8px', color: 'white', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
          <div style={{fontSize: '3rem', fontWeight: 'bold', color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.3)'}}>
            A
          </div>
          <div>
            <h1 style={{margin: '0', fontSize: '2rem', marginBottom: '0.3rem'}}>Admin Dashboard</h1>
            <p style={{margin: '0', fontSize: '0.9rem', opacity: '0.9'}}>Manage all user complaints</p>
          </div>
        </div>
        
        <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center'}}>
          <button 
            onClick={() => navigate('/')}
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
              e.target.style.color = '#dc3545';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = 'white';
            }}
          >
            Home
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
      
      {/* Complaints Content */}
      <div style={{background: 'white', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', overflow: 'hidden'}}>
        <div style={{padding: '1.5rem', borderBottom: '1px solid #eee'}}>
          <h2 style={{margin: 0, color: '#333'}}>All User Complaints</h2>
          <p style={{margin: '0.5rem 0 0 0', color: '#666', fontSize: '0.9rem'}}>
            Total: {complaints.length} complaints
          </p>
        </div>
        
        {complaints.length === 0 ? (
          <div style={{padding: '3rem', textAlign: 'center', color: '#666'}}>
            <p style={{fontSize: '1.1rem', marginBottom: '1rem'}}>No complaints found</p>
          </div>
        ) : (
          <div style={{padding: '1.5rem'}}>
            {complaints.map(complaint => (
              <div key={complaint.id} style={{border: '1px solid #ddd', padding: '1.5rem', marginBottom: '1.5rem', borderRadius: '8px', backgroundColor: '#f8f9fa'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem'}}>
                  <div style={{flex: 1}}>
                    <h3 style={{margin: '0 0 0.5rem 0', color: '#333', fontSize: '1.2rem'}}>
                      {complaint.title}
                    </h3>
                    <p style={{margin: '0', color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem'}}>
                      <strong>Ticket ID:</strong> {complaint.ticket_id} | 
                      <strong> User ID:</strong> {complaint.user_id} | 
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
                
                <p style={{margin: '0 0 1rem 0', color: '#555', lineHeight: '1.5'}}>
                  {complaint.description}
                </p>
                
                {complaint.solution && (
                  <div style={{backgroundColor: '#d4edda', padding: '1rem', borderRadius: '6px', marginTop: '1rem', marginBottom: '1rem'}}>
                    <p style={{margin: '0', color: '#155724'}}>{complaint.solution}</p>
                  </div>
                )}
                
                {/* Resolution Box */}
                {!complaint.solution && (
                  <div style={{backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', marginTop: '1rem', marginBottom: '1rem', border: '1px solid #dee2e6'}}>
                    <div style={{marginBottom: '1rem'}}>
                      <textarea
                        value={solutions[complaint.id] || ''}
                        onChange={(e) => handleSolutionChange(complaint.id, e.target.value)}
                        placeholder="Provide detailed solution for this complaint..."
                        rows={4}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #ddd',
                          borderRadius: '6px',
                          fontSize: '0.9rem',
                          resize: 'vertical',
                          fontFamily: 'inherit'
                        }}
                      />
                    </div>
                    
                    {/* Admin Actions */}
                    <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center'}}>
                      {complaint.status === 'Pending' && (
                        <>
                          <button 
                            onClick={() => handleUpdateStatus(complaint.id, 'In Progress')}
                            disabled={updateLoading === complaint.id}
                            style={{
                              padding: '0.5rem 1rem',
                              background: updateLoading === complaint.id ? '#ccc' : '#007bff',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: updateLoading === complaint.id ? 'not-allowed' : 'pointer',
                              fontSize: '0.8rem',
                              fontWeight: 'bold'
                            }}
                          >
                            {updateLoading === complaint.id ? 'Updating...' : 'Mark In Progress'}
                          </button>
                          
                          <button 
                            onClick={() => {
                              const solution = solutions[complaint.id];
                              if (solution && solution.trim()) {
                                handleUpdateSolution(complaint.id, solution.trim());
                              } else {
                                alert('Please enter a solution before resolving.');
                              }
                            }}
                            disabled={updateLoading === complaint.id}
                            style={{
                              padding: '0.5rem 1rem',
                              background: updateLoading === complaint.id ? '#ccc' : '#28a745',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: updateLoading === complaint.id ? 'not-allowed' : 'pointer',
                              fontSize: '0.8rem',
                              fontWeight: 'bold'
                            }}
                          >
                            {updateLoading === complaint.id ? 'Updating...' : 'Resolve'}
                          </button>
                          
                          <button 
                            onClick={() => handleUpdateStatus(complaint.id, 'Rejected')}
                            disabled={updateLoading === complaint.id}
                            style={{
                              padding: '0.5rem 1rem',
                              background: updateLoading === complaint.id ? '#ccc' : '#dc3545',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: updateLoading === complaint.id ? 'not-allowed' : 'pointer',
                              fontSize: '0.8rem',
                              fontWeight: 'bold'
                            }}
                          >
                            {updateLoading === complaint.id ? 'Updating...' : 'Reject'}
                          </button>
                        </>
                      )}
                      
                      {complaint.status === 'In Progress' && (
                        <>
                          <button 
                            onClick={() => {
                              const solution = solutions[complaint.id];
                              if (solution && solution.trim()) {
                                handleUpdateSolution(complaint.id, solution.trim());
                              } else {
                                alert('Please enter a solution before resolving.');
                              }
                            }}
                            disabled={updateLoading === complaint.id}
                            style={{
                              padding: '0.5rem 1rem',
                              background: updateLoading === complaint.id ? '#ccc' : '#28a745',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: updateLoading === complaint.id ? 'not-allowed' : 'pointer',
                              fontSize: '0.8rem',
                              fontWeight: 'bold'
                            }}
                          >
                            {updateLoading === complaint.id ? 'Updating...' : 'Resolve'}
                          </button>
                          
                          <button 
                            onClick={() => handleUpdateStatus(complaint.id, 'Rejected')}
                            disabled={updateLoading === complaint.id}
                            style={{
                              padding: '0.5rem 1rem',
                              background: updateLoading === complaint.id ? '#ccc' : '#dc3545',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: updateLoading === complaint.id ? 'not-allowed' : 'pointer',
                              fontSize: '0.8rem',
                              fontWeight: 'bold'
                            }}
                          >
                            {updateLoading === complaint.id ? 'Updating...' : 'Reject'}
                          </button>
                        </>
                      )}
                    </div>
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

export default AdminDashboard;

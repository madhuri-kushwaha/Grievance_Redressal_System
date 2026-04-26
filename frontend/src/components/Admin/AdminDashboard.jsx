import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllComplaints, updateComplaint } from '../../services/api';

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [solution, setSolution] = useState('');
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0, rejected: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const complaints = await getAllComplaints();
      setComplaints(complaints || []);
      calculateStats(complaints || []);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (complaints) => {
    const total = complaints.length;
    const pending = complaints.filter(c => c.status === 'Pending').length;
    const resolved = complaints.filter(c => c.status === 'Resolved').length;
    const rejected = complaints.filter(c => c.status === 'Rejected').length;
    setStats({ total, pending, resolved, rejected });
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

  const updateComplaintStatus = async (complaintId, newStatus, solutionText = '') => {
    try {
      const response = await updateComplaint(complaintId, newStatus, solutionText);
      
      if (response.message) {
        // Refresh complaints list
        await fetchComplaints();
        setSelectedComplaint(null);
        setSolution('');
        
        alert(`Complaint updated to ${newStatus} successfully!`);
      }
    } catch (error) {
      console.error('Error updating complaint:', error);
      alert('Failed to update complaint. Please try again.');
    }
  };

  const handleResolveComplaint = () => {
    if (!solution.trim()) {
      alert('Please provide a solution before resolving the complaint.');
      return;
    }
    updateComplaintStatus(selectedComplaint.id, 'Resolved', solution);
  };

  if (loading) return (
    <div style={{padding: '2rem', textAlign: 'center'}}>
      <h2>Loading admin dashboard...</h2>
    </div>
  );

  return (
    <div style={{padding: '2rem', maxWidth: '1400px', margin: '0 auto'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
        <h1 style={{color: '#333', margin: 0}}>Admin Dashboard</h1>
        <button 
          onClick={() => navigate('/dashboard')}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Back to User Dashboard
        </button>
      </div>
      
      {/* Stats Cards */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem'}}>
        <div style={{background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', textAlign: 'center'}}>
          <h3 style={{fontSize: '2rem', margin: '0', color: '#667eea'}}>{stats.total}</h3>
          <p style={{margin: '0.5rem 0 0 0', color: '#666'}}>Total Complaints</p>
        </div>
        <div style={{background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', textAlign: 'center'}}>
          <h3 style={{fontSize: '2rem', margin: '0', color: '#ffc107'}}>{stats.pending}</h3>
          <p style={{margin: '0.5rem 0 0 0', color: '#666'}}>Pending</p>
        </div>
        <div style={{background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', textAlign: 'center'}}>
          <h3 style={{fontSize: '2rem', margin: '0', color: '#28a745'}}>{stats.resolved}</h3>
          <p style={{margin: '0.5rem 0 0 0', color: '#666'}}>Resolved</p>
        </div>
        <div style={{background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', textAlign: 'center'}}>
          <h3 style={{fontSize: '2rem', margin: '0', color: '#dc3545'}}>{stats.rejected}</h3>
          <p style={{margin: '0.5rem 0 0 0', color: '#666'}}>Rejected</p>
        </div>
      </div>

      {/* Complaints Management */}
      <div style={{display: 'grid', gridTemplateColumns: selectedComplaint ? '1fr 1fr' : '1fr', gap: '2rem'}}>
        {/* Complaints List */}
        <div style={{background: 'white', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', overflow: 'hidden'}}>
          <div style={{padding: '1.5rem', borderBottom: '1px solid #eee'}}>
            <h2 style={{margin: 0, color: '#333'}}>All Complaints</h2>
          </div>
          
          <div style={{maxHeight: '600px', overflowY: 'auto'}}>
            {complaints.map(complaint => (
              <div 
                key={complaint.id} 
                style={{
                  padding: '1.5rem', 
                  borderBottom: '1px solid #eee', 
                  cursor: 'pointer',
                  backgroundColor: selectedComplaint?.id === complaint.id ? '#f8f9fa' : 'white'
                }}
                onClick={() => setSelectedComplaint(complaint)}
              >
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem'}}>
                  <div style={{flex: 1}}>
                    <h4 style={{margin: '0 0 0.5rem 0', color: '#333'}}>{complaint.title}</h4>
                    <p style={{margin: '0', color: '#666', fontSize: '0.9rem'}}>
                      <strong>Ticket:</strong> {complaint.ticket_id} | 
                      <strong> User:</strong> {complaint.username} | 
                      <strong> Date:</strong> {new Date(complaint.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      backgroundColor: getPriorityColor(complaint.priority),
                      color: getPriorityTextColor(complaint.priority)
                    }}>
                      {complaint.priority?.toUpperCase() || 'MEDIUM'}
                    </span>
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
                
                <p style={{margin: '0', color: '#555', lineHeight: '1.5', fontSize: '0.9rem'}}>
                  {complaint.description.substring(0, 150)}{complaint.description.length > 150 ? '...' : ''}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Complaint Details & Actions */}
        {selectedComplaint && (
          <div style={{background: 'white', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', overflow: 'hidden'}}>
            <div style={{padding: '1.5rem', borderBottom: '1px solid #eee'}}>
              <h2 style={{margin: 0, color: '#333'}}>Complaint Details</h2>
            </div>
            
            <div style={{padding: '1.5rem'}}>
              <div style={{marginBottom: '1.5rem'}}>
                <h4 style={{margin: '0 0 0.5rem 0', color: '#333'}}>{selectedComplaint.title}</h4>
                <p style={{margin: '0 0 1rem 0', color: '#666', fontSize: '0.9rem'}}>
                  <strong>Ticket ID:</strong> {selectedComplaint.ticket_id}<br/>
                  <strong>Category:</strong> {selectedComplaint.category}<br/>
                  <strong>Priority:</strong> {selectedComplaint.priority}<br/>
                  <strong>Status:</strong> {selectedComplaint.status}<br/>
                  <strong>Date:</strong> {new Date(selectedComplaint.created_at).toLocaleString()}
                </p>
                
                <div style={{marginBottom: '1rem'}}>
                  <strong style={{color: '#333'}}>User Details:</strong>
                  <p style={{margin: '0.5rem 0', color: '#666', fontSize: '0.9rem'}}>
                    Name: {selectedComplaint.username}<br/>
                    Email: {selectedComplaint.email}<br/>
                    Phone: {selectedComplaint.phone}
                  </p>
                </div>
                
                <div style={{marginBottom: '1rem'}}>
                  <strong style={{color: '#333'}}>Description:</strong>
                  <p style={{margin: '0.5rem 0', color: '#555', lineHeight: '1.5'}}>
                    {selectedComplaint.description}
                  </p>
                </div>
                
                {selectedComplaint.solution && (
                  <div style={{backgroundColor: '#d4edda', padding: '1rem', borderRadius: '6px', marginBottom: '1rem'}}>
                    <strong style={{color: '#155724'}}>Solution:</strong>
                    <p style={{margin: '0.5rem 0 0 0', color: '#155724'}}>{selectedComplaint.solution}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {selectedComplaint.status !== 'Resolved' && (
                <div>
                  <h5 style={{margin: '0 0 1rem 0', color: '#333'}}>Update Status:</h5>
                  
                  {selectedComplaint.status === 'Pending' && (
                    <button 
                      onClick={() => updateComplaintStatus(selectedComplaint.id, 'In Progress')}
                      style={{
                        padding: '0.75rem 1.5rem',
                        background: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        marginRight: '0.5rem',
                        marginBottom: '0.5rem'
                      }}
                    >
                      Mark In Progress
                    </button>
                  )}
                  
                  <button 
                    onClick={() => updateComplaintStatus(selectedComplaint.id, 'Rejected')}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      marginRight: '0.5rem',
                      marginBottom: '0.5rem'
                    }}
                  >
                    Reject
                  </button>
                </div>
              )}

              {/* Resolution Form */}
              {selectedComplaint.status !== 'Resolved' && (
                <div style={{marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #eee'}}>
                  <h5 style={{margin: '0 0 1rem 0', color: '#333'}}>Provide Solution:</h5>
                  <textarea
                    value={solution}
                    onChange={(e) => setSolution(e.target.value)}
                    placeholder="Enter solution details..."
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px',
                      height: '100px',
                      resize: 'vertical',
                      marginBottom: '1rem'
                    }}
                  />
                  <button 
                    onClick={handleResolveComplaint}
                    disabled={!solution.trim()}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: solution.trim() ? '#28a745' : '#ccc',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: solution.trim() ? 'pointer' : 'not-allowed',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}
                  >
                    Mark as Resolved
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserComplaints } from '../../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0, rejected: 0 });
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId');
      
      if (!userId) {
        navigate('/');
        return;
      }
      
      const complaints = await getUserComplaints(userId);
      setComplaints(complaints || []);
      
      // Calculate stats
      const total = complaints.length;
      const pending = complaints.filter(c => c.status === 'Pending').length;
      const resolved = complaints.filter(c => c.status === 'Resolved').length;
      const rejected = complaints.filter(c => c.status === 'Rejected').length;
      
      setStats({ total, pending, resolved, rejected });
    } catch (error) {
      console.error('Error:', error);
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
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
      <h2>Loading dashboard...</h2>
    </div>
  );

  return (
    <div style={{padding: '2rem', maxWidth: '1200px', margin: '0 auto'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
        <h1 style={{color: '#333', margin: 0}}>Grievance Dashboard</h1>
        <button 
          onClick={() => navigate('/complaint-form')}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          New Complaint
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

      {/* Complaints List */}
      <div style={{background: 'white', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', overflow: 'hidden'}}>
        <div style={{padding: '1.5rem', borderBottom: '1px solid #eee'}}>
          <h2 style={{margin: 0, color: '#333'}}>Complaint History</h2>
        </div>
        
        {complaints.length === 0 ? (
          <div style={{padding: '3rem', textAlign: 'center', color: '#666'}}>
            <p>No complaints found. Submit your first complaint to get started!</p>
            <button 
              onClick={() => navigate('/complaint-form')}
              style={{
                marginTop: '1rem',
                padding: '0.75rem 1.5rem',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Submit First Complaint
            </button>
          </div>
        ) : (
          <div>
            {complaints.map(complaint => (
              <div key={complaint.id} style={{padding: '1.5rem', borderBottom: '1px solid #eee', '&:last-child': {borderBottom: 'none'}}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem'}}>
                  <div style={{flex: 1}}>
                    <h4 style={{margin: '0 0 0.5rem 0', color: '#333'}}>{complaint.title}</h4>
                    <p style={{margin: '0', color: '#666', fontSize: '0.9rem'}}>
                      <strong>Ticket ID:</strong> {complaint.ticket_id} | 
                      <strong> Category:</strong> {complaint.category || 'N/A'} | 
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
                
                <p style={{margin: '0 0 1rem 0', color: '#555', lineHeight: '1.5'}}>
                  {complaint.description}
                </p>
                
                {complaint.solution && (
                  <div style={{backgroundColor: '#d4edda', padding: '1rem', borderRadius: '6px', marginTop: '1rem'}}>
                    <p style={{margin: '0', fontWeight: 'bold', color: '#155724'}}>Solution:</p>
                    <p style={{margin: '0.5rem 0 0 0', color: '#155724'}}>{complaint.solution}</p>
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

export default Dashboard;
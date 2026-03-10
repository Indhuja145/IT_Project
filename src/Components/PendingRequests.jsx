import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import './PendingRequests.css';

function PendingRequests() {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const fetchRequests = () => {
    setLoading(true);
    axios.get('http://localhost:5000/api/requests')
      .then(res => {
        setRequests(res.data);
        setFilteredRequests(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching requests:', err);
        showNotification('Failed to load requests', 'error');
        setRequests([]);
        setFilteredRequests([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    let filtered = requests;
    if (search) {
      filtered = filtered.filter(req => 
        req.employeeName?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (typeFilter !== 'All') {
      filtered = filtered.filter(req => req.requestType === typeFilter);
    }
    if (statusFilter !== 'All') {
      filtered = filtered.filter(req => req.status === statusFilter);
    }
    setFilteredRequests(filtered);
  }, [search, typeFilter, statusFilter, requests]);

  const handleApprove = (id) => {
    axios.put(`http://localhost:5000/api/requests/${id}`, { status: 'Approved' })
      .then(() => {
        fetchRequests();
        showNotification('Request approved successfully');
        setSelectedRequest(null);
      })
      .catch(err => showNotification('Failed to approve request', 'error'));
  };

  const handleReject = (id) => {
    axios.put(`http://localhost:5000/api/requests/${id}`, { status: 'Rejected' })
      .then(() => {
        fetchRequests();
        showNotification('Request rejected');
        setSelectedRequest(null);
      })
      .catch(err => showNotification('Failed to reject request', 'error'));
  };

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this request?')) return;
    axios.delete(`http://localhost:5000/api/requests/${id}`)
      .then(() => {
        fetchRequests();
        showNotification('Request deleted successfully');
        setSelectedRequest(null);
      })
      .catch(err => showNotification('Failed to delete request', 'error'));
  };

  const getPriorityClass = (priority) => {
    return priority?.toLowerCase() || 'low';
  };

  const getStatusClass = (status) => {
    return status?.toLowerCase() || 'pending';
  };

  const pendingCount = requests.filter(r => r.status === 'Pending').length;

  return (
    <div className="requests-container">
      {notification.show && (
        <motion.div 
          className={`notification ${notification.type}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          {notification.message}
        </motion.div>
      )}

      <div className="requests-header">
        <div>
          <h1>⏳ Pending Requests</h1>
          <p>Manage employee requests awaiting approval</p>
        </div>
        {pendingCount > 0 && (
          <motion.div 
            className="pending-badge"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            {pendingCount} Pending
          </motion.div>
        )}
      </div>

      <div className="filters-section">
        <input
          type="text"
          placeholder="🔍 Search by employee name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="filter-select">
          <option value="All">All Types</option>
          <option value="Leave">Leave</option>
          <option value="Access">Access</option>
          <option value="Equipment">Equipment</option>
          <option value="Document">Document</option>
          <option value="Meeting">Meeting</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter-select">
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <div className="table-container">
        {loading ? (
          <div className="loading">Loading requests...</div>
        ) : (
          <table className="requests-table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Employee Name</th>
                <th>Request Type</th>
                <th>Description</th>
                <th>Date Submitted</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan="8" className="no-data">No requests found</td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <motion.tr 
                    key={req._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ backgroundColor: 'rgba(139, 92, 246, 0.05)' }}
                  >
                    <td className="request-id">{req.requestId}</td>
                    <td>{req.employeeName}</td>
                    <td>{req.requestType}</td>
                    <td className="description">{req.description?.substring(0, 50)}...</td>
                    <td>{new Date(req.dateSubmitted).toLocaleDateString()}</td>
                    <td>
                      <span className={`priority-badge ${getPriorityClass(req.priority)}`}>
                        {req.priority}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusClass(req.status)}`}>
                        {req.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-btns">
                        {req.status === 'Pending' && (
                          <>
                            <button 
                              className="approve-btn"
                              onClick={() => handleApprove(req._id)}
                              title="Approve"
                            >
                              ✓
                            </button>
                            <button 
                              className="reject-btn"
                              onClick={() => handleReject(req._id)}
                              title="Reject"
                            >
                              ✗
                            </button>
                          </>
                        )}
                        <button 
                          className="view-btn"
                          onClick={() => setSelectedRequest(req)}
                          title="View Details"
                        >
                          👁
                        </button>
                        <button 
                          className="reject-btn"
                          onClick={() => handleDelete(req._id)}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      <AnimatePresence>
        {selectedRequest && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedRequest(null)}
          >
            <motion.div 
              className="modal-content"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2>Request Details</h2>
              <div className="modal-body">
                <div className="detail-row">
                  <strong>Request ID:</strong>
                  <span>{selectedRequest.requestId}</span>
                </div>
                <div className="detail-row">
                  <strong>Employee Name:</strong>
                  <span>{selectedRequest.employeeName}</span>
                </div>
                <div className="detail-row">
                  <strong>Request Type:</strong>
                  <span>{selectedRequest.requestType}</span>
                </div>
                <div className="detail-row">
                  <strong>Priority:</strong>
                  <span className={`priority-badge ${getPriorityClass(selectedRequest.priority)}`}>
                    {selectedRequest.priority}
                  </span>
                </div>
                <div className="detail-row">
                  <strong>Status:</strong>
                  <span className={`status-badge ${getStatusClass(selectedRequest.status)}`}>
                    {selectedRequest.status}
                  </span>
                </div>
                <div className="detail-row">
                  <strong>Date Submitted:</strong>
                  <span>{new Date(selectedRequest.dateSubmitted).toLocaleString()}</span>
                </div>
                <div className="detail-row full">
                  <strong>Description:</strong>
                  <p>{selectedRequest.description}</p>
                </div>
                {selectedRequest.attachments && (
                  <div className="detail-row full">
                    <strong>Attachments:</strong>
                    <p>{selectedRequest.attachments}</p>
                  </div>
                )}
              </div>
              <div className="modal-actions">
                {selectedRequest.status === 'Pending' && (
                  <>
                    <button 
                      className="modal-approve-btn"
                      onClick={() => handleApprove(selectedRequest._id)}
                    >
                      ✓ Approve
                    </button>
                    <button 
                      className="modal-reject-btn"
                      onClick={() => handleReject(selectedRequest._id)}
                    >
                      ✗ Reject
                    </button>
                  </>
                )}
                <button 
                  className="modal-reject-btn"
                  onClick={() => handleDelete(selectedRequest._id)}
                >
                  🗑️ Delete
                </button>
                <button 
                  className="modal-close-btn"
                  onClick={() => setSelectedRequest(null)}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default PendingRequests;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import './LeaveApproval.css';

function LeaveApproval() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/leaves');
      setLeaves(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch leaves', err);
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/leaves/${id}`, { status: 'Approved' });
      showNotification('Leave request approved', 'success');
      setSelectedLeave(null);
      fetchLeaves();
    } catch (err) {
      showNotification('Failed to approve leave', 'error');
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/leaves/${id}`, { status: 'Rejected' });
      showNotification('Leave request rejected', 'success');
      setSelectedLeave(null);
      fetchLeaves();
    } catch (err) {
      showNotification('Failed to reject leave', 'error');
    }
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const filteredLeaves = statusFilter === 'All' 
    ? leaves 
    : leaves.filter(l => l.status === statusFilter);

  const pendingCount = leaves.filter(l => l.status === 'Pending').length;

  return (
    <div className="leave-approval-container">
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

      <div className="approval-header">
        <div>
          <h1>✅ Leave Approvals</h1>
          <p>Review and manage employee leave requests</p>
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
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter-select">
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <div className="table-container">
        {loading ? (
          <div className="loading">Loading leave requests...</div>
        ) : (
          <table className="leave-approval-table">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Leave Type</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Days</th>
                <th>Submitted</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeaves.length === 0 ? (
                <tr>
                  <td colSpan="8" className="no-data">No leave requests found</td>
                </tr>
              ) : (
                filteredLeaves.map((leave) => (
                  <motion.tr 
                    key={leave._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ backgroundColor: 'rgba(139, 92, 246, 0.05)' }}
                  >
                    <td>{leave.employeeName}</td>
                    <td>{leave.leaveType}</td>
                    <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                    <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                    <td>{leave.numberOfDays}</td>
                    <td>{new Date(leave.submittedAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge ${leave.status.toLowerCase()}`}>
                        {leave.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-btns">
                        {leave.status === 'Pending' && (
                          <>
                            <button 
                              className="approve-btn"
                              onClick={() => handleApprove(leave._id)}
                              title="Approve"
                            >
                              ✓
                            </button>
                            <button 
                              className="reject-btn"
                              onClick={() => handleReject(leave._id)}
                              title="Reject"
                            >
                              ✗
                            </button>
                          </>
                        )}
                        <button 
                          className="view-btn"
                          onClick={() => setSelectedLeave(leave)}
                          title="View Details"
                        >
                          👁
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
        {selectedLeave && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedLeave(null)}
          >
            <motion.div 
              className="modal-content"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2>Leave Request Details</h2>
              <div className="modal-body">
                <div className="detail-row">
                  <strong>Employee Name:</strong>
                  <span>{selectedLeave.employeeName}</span>
                </div>
                <div className="detail-row">
                  <strong>Email:</strong>
                  <span>{selectedLeave.employeeEmail}</span>
                </div>
                <div className="detail-row">
                  <strong>Leave Type:</strong>
                  <span>{selectedLeave.leaveType}</span>
                </div>
                <div className="detail-row">
                  <strong>Start Date:</strong>
                  <span>{new Date(selectedLeave.startDate).toLocaleDateString()}</span>
                </div>
                <div className="detail-row">
                  <strong>End Date:</strong>
                  <span>{new Date(selectedLeave.endDate).toLocaleDateString()}</span>
                </div>
                <div className="detail-row">
                  <strong>Number of Days:</strong>
                  <span>{selectedLeave.numberOfDays}</span>
                </div>
                <div className="detail-row">
                  <strong>Status:</strong>
                  <span className={`status-badge ${selectedLeave.status.toLowerCase()}`}>
                    {selectedLeave.status}
                  </span>
                </div>
                <div className="detail-row full">
                  <strong>Reason:</strong>
                  <p>{selectedLeave.reason}</p>
                </div>
              </div>
              <div className="modal-actions">
                {selectedLeave.status === 'Pending' && (
                  <>
                    <button 
                      className="modal-approve-btn"
                      onClick={() => handleApprove(selectedLeave._id)}
                    >
                      ✓ Approve
                    </button>
                    <button 
                      className="modal-reject-btn"
                      onClick={() => handleReject(selectedLeave._id)}
                    >
                      ✗ Reject
                    </button>
                  </>
                )}
                <button 
                  className="modal-close-btn"
                  onClick={() => setSelectedLeave(null)}
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

export default LeaveApproval;

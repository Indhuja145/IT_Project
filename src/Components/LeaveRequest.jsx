import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import './LeaveRequest.css';

function LeaveRequest() {
  const [formData, setFormData] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const userName = localStorage.getItem('userName') || 'Employee';
  const userEmail = localStorage.getItem('userEmail') || '';

  useEffect(() => {
    fetchLeaveHistory();
  }, []);

  const fetchLeaveHistory = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/leaves/${userEmail}`);
      setLeaveHistory(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch leave history', err);
      setLoading(false);
    }
  };

  const calculateDays = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      return days > 0 ? days : 0;
    }
    return 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const days = calculateDays();
    
    if (days <= 0) {
      showNotification('Invalid date range', 'error');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/leaves', {
        employeeName: userName,
        employeeEmail: userEmail,
        leaveType: formData.leaveType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        numberOfDays: days,
        reason: formData.reason,
        status: 'Pending'
      });
      showNotification('Leave request submitted successfully!', 'success');
      setFormData({ leaveType: '', startDate: '', endDate: '', reason: '' });
      fetchLeaveHistory();
    } catch (err) {
      showNotification('Failed to submit leave request', 'error');
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this leave request?')) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/leaves/${id}`);
      showNotification('Leave request cancelled', 'success');
      fetchLeaveHistory();
    } catch (err) {
      showNotification('Failed to cancel leave request', 'error');
    }
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const leaveBalance = {
    total: 20,
    taken: leaveHistory.filter(l => l.status === 'Approved').reduce((sum, l) => sum + l.numberOfDays, 0),
    remaining: 20 - leaveHistory.filter(l => l.status === 'Approved').reduce((sum, l) => sum + l.numberOfDays, 0)
  };

  return (
    <div className="leave-request-page">
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

      <div className="page-header">
        <h1>🏖️ Leave Request</h1>
        <p>Manage your leave applications</p>
      </div>

      <div className="leave-summary">
        <motion.div className="summary-card total" whileHover={{ y: -5 }}>
          <div className="card-icon">📊</div>
          <div className="card-content">
            <h3>Total Leave Balance</h3>
            <p className="card-number">{leaveBalance.total}</p>
            <span className="card-label">Days per year</span>
          </div>
        </motion.div>

        <motion.div className="summary-card taken" whileHover={{ y: -5 }}>
          <div className="card-icon">✅</div>
          <div className="card-content">
            <h3>Leaves Taken</h3>
            <p className="card-number">{leaveBalance.taken}</p>
            <span className="card-label">This year</span>
          </div>
        </motion.div>

        <motion.div className="summary-card remaining" whileHover={{ y: -5 }}>
          <div className="card-icon">🎯</div>
          <div className="card-content">
            <h3>Remaining Leaves</h3>
            <p className="card-number">{leaveBalance.remaining}</p>
            <span className="card-label">Available</span>
          </div>
        </motion.div>
      </div>

      <div className="leave-form-section">
        <h2>📝 Submit Leave Request</h2>
        <form onSubmit={handleSubmit} className="leave-form">
          <div className="form-row">
            <div className="form-group">
              <label>Leave Type *</label>
              <select
                value={formData.leaveType}
                onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
                required
              >
                <option value="">Select Leave Type</option>
                <option value="Casual Leave">Casual Leave</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Paid Leave">Paid Leave</option>
                <option value="Emergency Leave">Emergency Leave</option>
              </select>
            </div>

            <div className="form-group">
              <label>Start Date *</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>End Date *</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Number of Days</label>
              <input
                type="text"
                value={calculateDays()}
                readOnly
                className="readonly-input"
              />
            </div>
          </div>

          <div className="form-group full-width">
            <label>Reason for Leave *</label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="Enter reason for leave..."
              rows="4"
              required
            />
          </div>

          <button type="submit" className="submit-btn">
            📤 Submit Request
          </button>
        </form>
      </div>

      <div className="leave-history-section">
        <div className="history-header">
          <h2>📋 Leave History</h2>
        </div>

        {loading ? (
          <div className="loading">Loading leave history...</div>
        ) : (
          <table className="leave-table">
            <thead>
              <tr>
                <th>Leave Type</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaveHistory.length === 0 ? (
                <tr>
                  <td colSpan="7" className="no-data">No leave requests found</td>
                </tr>
              ) : (
                leaveHistory.map((leave) => (
                  <motion.tr
                    key={leave._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <td>{leave.leaveType}</td>
                    <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                    <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                    <td>{leave.numberOfDays}</td>
                    <td>{leave.reason.substring(0, 30)}...</td>
                    <td>
                      <span className={`status-badge ${leave.status.toLowerCase()}`}>
                        {leave.status === 'approved' ? '✅ Approved' : 
                         leave.status === 'rejected' ? '❌ Rejected' : 
                         '⏳ Pending'}
                      </span>
                    </td>
                    <td>
                      {leave.status.toLowerCase() === 'pending' && (
                        <button
                          className="cancel-btn"
                          onClick={() => handleCancel(leave._id)}
                        >
                          ❌ Cancel
                        </button>
                      )}
                      {leave.status.toLowerCase() === 'approved' && (
                        <span style={{color: '#66bb6a', fontWeight: 'bold'}}>✓ Verified</span>
                      )}
                      {leave.status.toLowerCase() === 'rejected' && (
                        <span style={{color: '#ef5350', fontWeight: 'bold'}}>✗ Not Verified</span>
                      )}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default LeaveRequest;

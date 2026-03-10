import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import './EmployeeDashboard.css';

function EmployeeDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [stats, setStats] = useState({
    daysPresent: 0,
    daysAbsent: 0,
    leavesTaken: 0,
    pendingRequests: 0
  });
  const [meetings, setMeetings] = useState([]);
  const [requests, setRequests] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      navigate('/');
      return;
    }
    fetchUserData(userEmail);
    fetchMeetings(userEmail);
    fetchDocuments();
    fetchLeaves(userEmail);
    fetchRequests(userEmail);
    fetchAttendance(userEmail);
  }, [navigate]);

  const fetchUserData = async (email) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/user-profile/${email}`);
      setUser(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error:', err);
      setLoading(false);
    }
  };

  const fetchMeetings = async (email) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/user-meetings/${email}`);
      setMeetings(res.data.slice(0, 3));
    } catch (err) {
      setMeetings([]);
    }
  };

  const fetchDocuments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/documents');
      setDocuments(res.data.slice(0, 4));
    } catch (err) {
      setDocuments([]);
    }
  };

  const fetchLeaves = async (email) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/leaves/${email}`);
      const approvedLeaves = res.data.filter(leave => leave.status === 'approved');
      const totalDays = approvedLeaves.reduce((sum, leave) => sum + (leave.numberOfDays || 0), 0);
      setStats(prev => ({ ...prev, leavesTaken: totalDays }));
    } catch (err) {
      console.error('Error fetching leaves:', err);
    }
  };

  const fetchRequests = async (email) => {
    try {
      const res = await axios.get('http://localhost:5000/api/requests');
      const userRequests = res.data.filter(req => req.employeeEmail === email);
      const pending = userRequests.filter(req => req.status === 'pending').length;
      setStats(prev => ({ ...prev, pendingRequests: pending }));
    } catch (err) {
      console.error('Error fetching requests:', err);
    }
  };

  const fetchAttendance = async (email) => {
    try {
      const res = await axios.get('http://localhost:5000/api/attendance');
      const userAttendance = res.data.filter(att => att.employeeEmail === email);
      const present = userAttendance.filter(att => att.status?.toLowerCase() === 'present').length;
      const absent = userAttendance.filter(att => att.status?.toLowerCase() === 'absent').length;
      setStats(prev => ({ ...prev, daysPresent: present, daysAbsent: absent }));
    } catch (err) {
      console.error('Error fetching attendance:', err);
      setStats(prev => ({ ...prev, daysPresent: 0, daysAbsent: 0 }));
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.clear();
      navigate('/');
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="employee-dashboard">
      {/* Sidebar */}
      <motion.div 
        className="sidebar"
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <motion.h2 
          className="logo"
          whileHover={{ scale: 1.05 }}
        >💼 IT-MIS</motion.h2>
        <p className="portal-label">Employee Portal</p>
        <ul>
          {[
            { to: "/dashboard", icon: "🏠", text: "Dashboard" },
            { to: "#", icon: "👤", text: "My Profile", onClick: () => setShowProfile(true) },
            { to: "/attendance", icon: "📅", text: "Attendance" },
            { to: "/leave", icon: "🏖️", text: "Leave Request" },
            { to: "/meetings", icon: "🤝", text: "My Meetings" },
            { to: "/documents", icon: "📄", text: "Documents" },
            { to: "/inventory", icon: "📦", text: "Inventory" },
            { to: "/requests", icon: "📋", text: "My Requests" },
            { to: "/query", icon: "❓", text: "Raise Query" },
            { to: "/reports", icon: "📊", text: "Reports" }
          ].map((item, index) => (
            <motion.li 
              key={item.to}
              className={item.text === "Dashboard" ? "active" : ""}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ x: 5 }}
              onClick={item.onClick}
            >
              {item.onClick ? (
                <a href="#" onClick={(e) => { e.preventDefault(); item.onClick(); }}>
                  {item.icon} {item.text}
                </a>
              ) : (
                <Link to={item.to}>{item.icon} {item.text}</Link>
              )}
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* Main Content */}
      <div className="main-content">
        <motion.div 
          className="topbar"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div>
            <h2>{getGreeting()}, {user?.name || 'Employee'}! 👋</h2>
            <p>Welcome to your dashboard</p>
          </div>
          <div className="topbar-right">
            <div className="user-avatar" onClick={() => setShowProfile(true)}>
              <div className="avatar">{user?.name?.charAt(0) || 'E'}</div>
              <span>{user?.name}</span>
            </div>
            <motion.button 
              onClick={handleLogout} 
              className="logout-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🚪 Logout
            </motion.button>
          </div>
        </motion.div>

        {/* Dashboard Content */}
        <div className="cards">
          {[
            { icon: "📅", title: "Days Present", value: stats.daysPresent, label: "This month", color: "blue" },
            { icon: "🏖️", title: "Leaves Taken", value: stats.leavesTaken, label: "This year", color: "orange" },
            { icon: "⏳", title: "Pending Requests", value: stats.pendingRequests, label: "Awaiting approval", color: "purple" },
            { icon: "🤝", title: "Meetings Today", value: meetings.length, label: "Scheduled", color: "green" }
          ].map((card, index) => (
            <motion.div 
              key={card.title}
              className={`card card-${card.color}`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ y: -10, boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}
            >
              <motion.div 
                className="card-icon"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                {card.icon}
              </motion.div>
              <div className="card-content">
                <h3>{card.title}</h3>
                <motion.p 
                  className="card-number"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1, type: "spring" }}
                >
                  {card.value}
                </motion.p>
                <span className="card-label">{card.label}</span>
              </div>
            </motion.div>
          ))}
        </div>

          {/* Quick Actions */}
          <motion.div 
            className="quick-actions"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h3>⚡ Quick Actions</h3>
            <div className="action-buttons">
              {[
                { to: "/leave", icon: "🏖️", text: "Request Leave" },
                { to: "/inventory", icon: "📦", text: "Request Inventory" },
                { to: "/documents", icon: "📄", text: "View Documents" },
                { to: "/query", icon: "❓", text: "Raise Query" }
              ].map((action, index) => (
                <Link
                  key={action.text}
                  to={action.to}
                  className="action-btn"
                  style={{ textDecoration: 'none' }}
                >
                  <motion.button
                    className="action-btn"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>{action.icon}</span>
                    {action.text}
                  </motion.button>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Meetings & Documents */}
          <div className="content-grid">
            <motion.div 
              className="section-card"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
            >
              <h3>🤝 Upcoming Meetings</h3>
              {meetings.length === 0 ? (
                <p className="no-data">No upcoming meetings</p>
              ) : (
                meetings.map(meeting => (
                  <div key={meeting._id} className="meeting-item">
                    <h4>{meeting.title}</h4>
                    <p>{meeting.description}</p>
                    <div className="meeting-meta">
                      <span>📅 {new Date(meeting.date).toLocaleDateString()}</span>
                      <span>🕐 {meeting.time}</span>
                    </div>
                  </div>
                ))
              )}
            </motion.div>

            <motion.div 
              className="section-card"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 }}
            >
              <h3>📄 Recent Documents</h3>
              {documents.length === 0 ? (
                <p className="no-data">No documents available</p>
              ) : (
                documents.map(doc => (
                  <div key={doc._id} className="document-item">
                    <div className="doc-info">
                      <h4>{doc.title}</h4>
                      <p>{new Date(doc.uploadDate).toLocaleDateString()}</p>
                    </div>
                    <a 
                      href={`http://localhost:5000/uploads/${doc.fileName}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="download-link"
                    >
                      ⬇️
                    </a>
                  </div>
                ))
              )}
            </motion.div>
          </div>
      </div>

      {/* Profile Modal */}
      {showProfile && (
        <div className="modal-overlay" onClick={() => setShowProfile(false)}>
          <motion.div 
            className="profile-modal"
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="profile-header">
              <div className="profile-avatar">{user?.name?.charAt(0)}</div>
              <h2>{user?.name}</h2>
              <p>{user?.role}</p>
            </div>
            <div className="profile-details">
              <div className="detail-item">
                <span>📧 Email:</span>
                <span>{user?.email}</span>
              </div>
              <div className="detail-item">
                <span>🆔 Roll No:</span>
                <span>{user?.rollNo}</span>
              </div>
              <div className="detail-item">
                <span>💼 Job Type:</span>
                <span>{user?.jobType || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span>⏱️ Experience:</span>
                <span>{user?.experience || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span>💻 System:</span>
                <span>{user?.system || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span>📅 Joined:</span>
                <span>{user?.dateOfJoining ? new Date(user.dateOfJoining).toLocaleDateString() : 'N/A'}</span>
              </div>
            </div>
            <button className="close-btn" onClick={() => setShowProfile(false)}>Close</button>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default EmployeeDashboard;

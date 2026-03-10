import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import "./Admin.css";

function Admin() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingRequests: 0,
    meetingsToday: 0,
    inventoryItems: 0
  });
  const [loading, setLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      navigate('/');
      return;
    }
    checkUserRole(email);
    fetchStats();
    fetchAdminData();
  }, []);

  const checkUserRole = async (email) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/user-profile/${email}`);
      if (res.data.role !== 'admin') {
        alert('Access denied. You are no longer an admin.');
        localStorage.clear();
        navigate('/');
      }
    } catch (err) {
      console.error('Failed to verify role', err);
      navigate('/');
    }
  };

  const fetchAdminData = async () => {
    try {
      const email = localStorage.getItem('userEmail');
      if (email) {
        const res = await axios.get(`http://localhost:5000/api/user-profile/${email}`);
        setAdminData(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch admin data', err);
    }
  };

  const fetchStats = async () => {
    try {
      const [usersRes, inventoryRes, meetingsRes, queriesRes] = await Promise.allSettled([
        axios.get("http://localhost:5000/api/users"),
        axios.get("http://localhost:5000/api/get-inventory"),
        axios.get("http://localhost:5000/api/meetings"),
        axios.get("http://localhost:5000/api/queries")
      ]);

      const today = new Date().toDateString();
      const todayMeetings = meetingsRes.status === 'fulfilled' 
        ? meetingsRes.value.data.filter((m) => new Date(m.date).toDateString() === today).length
        : 0;
      
      const pendingQueries = queriesRes.status === 'fulfilled'
        ? queriesRes.value.data.filter((q) => q.status === 'open').length
        : 0;

      setStats({
        totalUsers: usersRes.status === 'fulfilled' ? usersRes.value.data.length : 0,
        pendingRequests: pendingQueries,
        meetingsToday: todayMeetings,
        inventoryItems: inventoryRes.status === 'fulfilled' ? inventoryRes.value.data.length : 0
      });
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch stats", err);
      setLoading(false);
    }
  };

  function handleLogout() {
    if (window.confirm("Are you sure you want to logout?")) {
      navigate("/");
    }
  }

  return (
    <div className="admin-container">
      <motion.div 
        className="sidebar"
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <motion.h2 
          className="logo"
          whileHover={{ scale: 1.05 }}
        >💻 IT-MIS</motion.h2>
        <ul>
          {[
            { to: "/admin", icon: "🏠", text: "Dashboard" },
            { to: "/user", icon: "👥", text: "Users" },
            { to: "/leave-approval", icon: "✅", text: "Leave Approvals" },
            { to: "/requests", icon: "⏳", text: "Pending Requests" },
            { to: "/meetings", icon: "📅", text: "Meetings" },
            { to: "/documents", icon: "📄", text: "Documents" },
            { to: "/inventory", icon: "📦", text: "Inventory" },
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
            >
              <Link to={item.to}>{item.icon} {item.text}</Link>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      <div className="main-content">
        <motion.div 
          className="topbar"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2>🏛️ Admin Dashboard</h2>
          <div className="topbar-right">
            <div className="user-avatar" onClick={() => setShowProfile(true)}>
              <div className="avatar">{adminData?.name?.charAt(0) || 'A'}</div>
              <span>{adminData?.name || 'Admin'}</span>
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

        {loading ? (
          <motion.div 
            className="loading-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Loading dashboard...
          </motion.div>
        ) : (
          <div className="cards">
            {[
              { icon: "👥", title: "Total Users", value: stats.totalUsers, label: "Active users", color: "blue" },
              { icon: "⏳", title: "Pending Requests", value: stats.pendingRequests, label: "Awaiting approval", color: "orange" },
              { icon: "📅", title: "Meetings Today", value: stats.meetingsToday, label: "Scheduled meetings", color: "green" },
              { icon: "📦", title: "Inventory Items", value: stats.inventoryItems, label: "Total items", color: "purple" }
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
        )}

        <motion.div 
          className="quick-actions"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            {[
              { to: "/user", icon: "➕", text: "Add User" },
              { to: "/meetings", icon: "📅", text: "Schedule Meeting" },
              { to: "/documents", icon: "📎", text: "Upload Document" },
              { to: "/inventory", icon: "📦", text: "Add Inventory" }
            ].map((action, index) => (
              <motion.div
                key={action.to}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + index * 0.1 }}
              >
                <Link 
                  to={action.to} 
                  className="action-btn"
                >
                  <motion.span
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.3 }}
                  >
                    {action.icon}
                  </motion.span>
                  {action.text}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {showProfile && (
        <div className="modal-overlay" onClick={() => setShowProfile(false)}>
          <motion.div 
            className="profile-modal"
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="profile-header">
              <div className="profile-avatar">{adminData?.name?.charAt(0) || 'A'}</div>
              <h2>{adminData?.name || 'Admin'}</h2>
              <p>{adminData?.role?.toUpperCase() || 'ADMINISTRATOR'}</p>
            </div>
            <div className="profile-details">
              <div className="detail-item">
                <span>📧 Email:</span>
                <span>{adminData?.email || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span>🆔 Roll No:</span>
                <span>{adminData?.rollNo || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span>💼 Role:</span>
                <span>{adminData?.role?.toUpperCase() || 'ADMINISTRATOR'}</span>
              </div>
              <div className="detail-item">
                <span>📅 Joined:</span>
                <span>{adminData?.dateOfJoining ? new Date(adminData.dateOfJoining).toLocaleDateString() : 'N/A'}</span>
              </div>
            </div>
            <button className="close-btn" onClick={() => setShowProfile(false)}>Close</button>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default Admin;

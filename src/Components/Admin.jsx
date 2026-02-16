import React from "react";
import { useNavigate,Link } from "react-router-dom";
import "./Admin.css";

function Admin() {
  const navigate = useNavigate();

  function handleLogout() {
    navigate("/");
  }

  return (
    <div className="admin-container">
      
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="logo">IT-MIS</h2>
        <ul>
          <li><Link to= "/admin">Dashboard</Link></li>
          <li><Link to = "/user">Users</Link></li>
          <li><Link to = "/meetings">Meetings</Link></li>
          <li><Link to = "/documents">Document</Link></li>
          <li>Inventory</li>
          <li>Reports</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        
        <div className="topbar">
          <h2>Admin Dashboard</h2>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>

        <div className="cards">
          <div className="card">
            <h3>Total Users</h3>
            <p>25</p>
          </div>

          <div className="card">
            <h3>Pending Requests</h3>
            <p>5</p>
          </div>

          <div className="card">
            <h3>Meetings Today</h3>
            <p>3</p>
          </div>

          <div className="card">
            <h3>Inventory Items</h3>
            <p>120</p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Admin;

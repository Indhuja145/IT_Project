import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAuthHeaders } from "./Auth";
import "./User.css";

const apiUrl = "http://localhost:5000/api";

function User() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    rollNo: "",
    name: "",
    email: "",
    role: "",
    jobType: "",
    experience: "",
    system: "",
    dateOfJoining: ""
  });

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
  };

  const fetchUsers = () => {
    setLoading(true);
    axios
      .get(`${apiUrl}/users`, { headers: getAuthHeaders() })
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        showNotification("Failed to load users", "error");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.email?.toLowerCase().includes(search.toLowerCase()) ||
    user.name?.toLowerCase().includes(search.toLowerCase()) ||
    user.rollNo?.toLowerCase().includes(search.toLowerCase())
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const request = editingId
      ? axios.put(`${apiUrl}/update-user/${editingId}`, formData, { headers: getAuthHeaders() })
      : axios.post(`${apiUrl}/add-user`, formData, { headers: getAuthHeaders() });

    request
      .then(() => {
        fetchUsers();
        showNotification(editingId ? "User updated successfully" : "User added successfully");
        setFormData({
          rollNo: "",
          name: "",
          email: "",
          role: "",
          jobType: "",
          experience: "",
          system: "",
          dateOfJoining: ""
        });
        setEditingId(null);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        const errorMsg = err.response?.data?.message || "Operation failed";
        showNotification(errorMsg, "error");
        setLoading(false);
      });
  };

  const handleEdit = (user) => {
    setEditingId(user._id);
    setFormData({
      rollNo: user.rollNo,
      name: user.name,
      email: user.email,
      role: user.role,
      jobType: user.jobType,
      experience: user.experience,
      system: user.system,
      dateOfJoining: user.dateOfJoining ? user.dateOfJoining.split('T')[0] : ""
    });
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    setLoading(true);
    axios
      .delete(`${apiUrl}/delete-user/${id}`, { headers: getAuthHeaders() })
      .then(() => {
        fetchUsers();
        showNotification("User deleted successfully");
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        const errorMsg = err.response?.data?.message || "Failed to delete user";
        showNotification(errorMsg, "error");
        setLoading(false);
      });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      rollNo: "",
      name: "",
      email: "",
      role: "",
      jobType: "",
      experience: "",
      system: "",
      dateOfJoining: ""
    });
  };

  return (
    <div className="user-container">
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <div className="top-section">
        <h1 className="list">👥 User Management</h1>
        <input
          type="text"
          placeholder="🔍 Search by name, email or roll no..."
          className="search-bar"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="table-wrapper">
        {loading && <div className="loading-spinner">Loading...</div>}
        <table>
          <thead>
            <tr>
              <th>Roll No</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Job Type</th>
              <th>Experience</th>
              <th>System</th>
              <th>Date of Joining</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="9" className="no-data">No users found</td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td className="roll-no">{user.rollNo}</td>
                  <td className="user-name">{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge ${user.role}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>{user.jobType}</td>
                  <td>{user.experience}</td>
                  <td>{user.system}</td>
                  <td>
                    {user.dateOfJoining
                      ? new Date(user.dateOfJoining).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(user)}
                        disabled={loading}
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(user._id)}
                        disabled={loading}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="form-section">
        <h2>{editingId ? "✏️ Edit User" : "➕ Add New User"}</h2>
        <form onSubmit={handleSubmit} className="user-form">
          <input
            name="rollNo"
            placeholder="Roll Number (Auto-generated if empty)"
            value={formData.rollNo}
            onChange={handleChange}
            disabled={loading}
          />
          <input
            name="name"
            placeholder="Full Name *"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <input
            name="email"
            type="email"
            placeholder="Email *"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            disabled={loading}
          >
            <option value="">Select Role *</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="manager">Manager</option>
          </select>
          <input
            name="jobType"
            placeholder="Job Type"
            value={formData.jobType}
            onChange={handleChange}
            disabled={loading}
          />
          <input
            name="experience"
            placeholder="Experience (e.g., 2 years)"
            value={formData.experience}
            onChange={handleChange}
            disabled={loading}
          />
          <input
            name="system"
            placeholder="System"
            value={formData.system}
            onChange={handleChange}
            disabled={loading}
          />
          <input
            type="date"
            name="dateOfJoining"
            value={formData.dateOfJoining}
            onChange={handleChange}
            disabled={loading}
          />

          <div className="button-center">
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Processing..." : editingId ? "Update User" : "Add User"}
            </button>
            {editingId && (
              <button
                type="button"
                className="cancel-btn"
                onClick={handleCancelEdit}
                disabled={loading}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default User;

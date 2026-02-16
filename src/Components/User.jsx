import React, { useEffect, useState } from "react";
import axios from "axios";
import "./User.css";

function User() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
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

  // Fetch all users
  const fetchUsers = () => {
    axios
      .get("http://localhost:5000/api/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Search filter
  const filteredUsers = users.filter((user) =>
    user.email?.toLowerCase().includes(search.toLowerCase()) ||
    user.name?.toLowerCase().includes(search.toLowerCase())
  );

  // Handle form input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:5000/api/add-user", formData)
      .then(() => {
        fetchUsers(); // Refresh table
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
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="user-container">

      {/* Top Section */}
      <div className="top-section">
        <h1 className="list">User Management</h1>
        <input
          type="text"
          placeholder="Search by name or email..."
          className="search-bar"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="table-wrapper">
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
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.rollNo}>
                <td>{user.rollNo}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.jobType}</td>
                <td>{user.experience}</td>
                <td>{user.system}</td>
                <td>
                  {user.dateOfJoining
                    ? new Date(user.dateOfJoining).toLocaleDateString()
                    : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Form */}
      <div className="form-section">
        <h2>Add New User</h2>
        <form onSubmit={handleSubmit} className="user-form">
          <input
            name="rollNo"
            placeholder="Roll Number"
            value={formData.rollNo}
            onChange={handleChange}
            required
          />
          <input
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            name="role"
            placeholder="Role (admin/user)"
            value={formData.role}
            onChange={handleChange}
            required
          />
          <input
            name="jobType"
            placeholder="Job Type"
            value={formData.jobType}
            onChange={handleChange}
          />
          <input
            name="experience"
            placeholder="Experience"
            value={formData.experience}
            onChange={handleChange}
          />
          <input
            name="system"
            placeholder="System"
            value={formData.system}
            onChange={handleChange}
          />
          <input
            type="date"
            name="dateOfJoining"
            value={formData.dateOfJoining}
            onChange={handleChange}
          />

          <div className="button-center">
            <button type="submit" className="submit-btn">
              Add User
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}

export default User;

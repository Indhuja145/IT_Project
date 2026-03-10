import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Meeting.css";

function Meeting() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    assignedTo: "",
    createdBy: ""
  });

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
  };

  const fetchMeetings = () => {
    setLoading(true);
    axios
      .get("http://localhost:5000/api/meetings")
      .then((res) => {
        setMeetings(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching meetings:', err);
        showNotification("Failed to load meetings", "error");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    axios
      .post("http://localhost:5000/api/add-meeting", formData)
      .then(() => {
        fetchMeetings();
        showNotification("Meeting added successfully");
        setFormData({
          title: "",
          description: "",
          date: "",
          time: "",
          assignedTo: "",
          createdBy: ""
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error adding meeting:', err);
        showNotification("Failed to add meeting", "error");
        setLoading(false);
      });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this meeting?")) return;
    setLoading(true);
    axios
      .delete(`http://localhost:5000/api/delete-meeting/${id}`)
      .then(() => {
        fetchMeetings();
        showNotification("Meeting deleted successfully");
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error deleting meeting:', err);
        showNotification("Failed to delete meeting", "error");
        setLoading(false);
      });
  };

  return (
    <div className="meeting-container">
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <h1 className="meeting-title">📅 Meeting Management</h1>

      <div className="table-wrapper">
        {loading && <div className="loading-spinner">Loading...</div>}
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Date</th>
              <th>Time</th>
              <th>Assigned To</th>
              <th>Created By</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {meetings.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data">No meetings scheduled</td>
              </tr>
            ) : (
              meetings.map((meeting) => (
                <tr key={meeting._id}>
                  <td>{meeting.title}</td>
                  <td>{meeting.description}</td>
                  <td>
                    {meeting.date
                      ? new Date(meeting.date).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td>{meeting.time}</td>
                  <td>{meeting.assignedTo}</td>
                  <td>{meeting.createdBy}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(meeting._id)}
                      disabled={loading}
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="form-section">
        <h2>➕ Add New Meeting</h2>

        <form onSubmit={handleSubmit} className="meeting-form">

          <input
            name="title"
            placeholder="Meeting Title"
            value={formData.title}
            onChange={handleChange}
            required
            disabled={loading}
          />

          <input
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            disabled={loading}
          />

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            disabled={loading}
          />

          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
            disabled={loading}
          />

          <input
            name="assignedTo"
            placeholder="Assigned To (User Email)"
            value={formData.assignedTo}
            onChange={handleChange}
            required
            disabled={loading}
          />

          <input
            name="createdBy"
            placeholder="Created By"
            value={formData.createdBy}
            onChange={handleChange}
            required
            disabled={loading}
          />

          <div className="button-center">
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Adding..." : "Add Meeting"}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}

export default Meeting;

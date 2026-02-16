import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Meeting.css";

function Meeting() {
  const [meetings, setMeetings] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    createdBy: ""
  });

  // Fetch all meetings
  const fetchMeetings = () => {
    axios
      .get("http://localhost:5000/api/meetings")
      .then((res) => setMeetings(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add meeting
  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:5000/api/add-meeting", formData)
      .then(() => {
        fetchMeetings();
        setFormData({
          title: "",
          description: "",
          date: "",
          time: "",
          createdBy: ""
        });
      })
      .catch((err) => console.log(err));
  };

  // Delete meeting
  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5000/api/delete-meeting/${id}`)
      .then(() => fetchMeetings())
      .catch((err) => console.log(err));
  };

  return (
    <div className="meeting-container">

      <h1 className="meeting-title">Meeting Management</h1>

      {/* Table Section */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Date</th>
              <th>Time</th>
              <th>Created By</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {meetings.map((meeting) => (
              <tr key={meeting._id}>
                <td>{meeting.title}</td>
                <td>{meeting.description}</td>
                <td>
                  {meeting.date
                    ? new Date(meeting.date).toLocaleDateString()
                    : "N/A"}
                </td>
                <td>{meeting.time}</td>
                <td>{meeting.createdBy}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(meeting._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Form Section */}
      <div className="form-section">
        <h2>Add New Meeting</h2>

        <form onSubmit={handleSubmit} className="meeting-form">

          <input
            name="title"
            placeholder="Meeting Title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <input
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
          />

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />

          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          />

          <input
            name="createdBy"
            placeholder="Created By"
            value={formData.createdBy}
            onChange={handleChange}
            required
          />

          <div className="button-center">
            <button type="submit" className="submit-btn">
              Add Meeting
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}

export default Meeting;

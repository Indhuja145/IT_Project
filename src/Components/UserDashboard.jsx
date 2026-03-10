import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import './UserDashboard.css';

function UserDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [queries, setQueries] = useState([]);
  const [newQuery, setNewQuery] = useState({ title: '', description: '' });
  const [answerText, setAnswerText] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      navigate('/');
      return;
    }
    fetchUserData(userEmail);
    fetchMeetings(userEmail);
    fetchQueries();
  }, [navigate]);

  const fetchUserData = async (email) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/user-profile/${email}`);
      setUser(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching user:', err);
      setLoading(false);
      navigate('/');
    }
  };

  const fetchMeetings = async (email) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/user-meetings/${email}`);
      setMeetings(res.data);
    } catch (err) {
      console.error('Error fetching meetings:', err);
      setMeetings([]);
    }
  };

  const fetchQueries = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/queries');
      setQueries(res.data);
    } catch (err) {
      console.error('Error fetching queries:', err.response?.status, err.message);
      setQueries([]);
    }
  };

  const handlePostQuery = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/add-query', {
        ...newQuery,
        postedBy: user.name,
        postedByEmail: user.email
      });
      setNewQuery({ title: '', description: '' });
      fetchQueries();
      alert('Query posted successfully!');
    } catch (err) {
      alert('Failed to post query');
    }
  };

  const handleAnswerQuery = async (queryId) => {
    try {
      await axios.post(`http://localhost:5000/api/answer-query/${queryId}`, {
        answer: answerText[queryId],
        answeredBy: user.name,
        answeredByEmail: user.email
      });
      setAnswerText({ ...answerText, [queryId]: '' });
      fetchQueries();
      alert('Answer posted successfully!');
    } catch (err) {
      alert('Failed to post answer');
    }
  };

  const handleDeleteQuery = async (queryId) => {
    if (!window.confirm('Are you sure you want to delete this query?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/delete-query/${queryId}`);
      fetchQueries();
      alert('Query deleted successfully!');
    } catch (err) {
      alert('Failed to delete query');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    navigate('/');
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <motion.div 
      className="user-dashboard-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="dashboard-header">
        <h1>👤 User Dashboard</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>

      <div className="dashboard-grid">
        <motion.div 
          className="profile-card"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <h2>My Profile</h2>
          <div className="profile-info">
            <p><strong>Name:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Roll No:</strong> {user?.rollNo}</p>
            <p><strong>Role:</strong> {user?.role}</p>
            <p><strong>Joined:</strong> {new Date(user?.dateOfJoining).toLocaleDateString()}</p>
          </div>
        </motion.div>

        <motion.div 
          className="meetings-card"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <h2>📅 My Meetings</h2>
          {meetings.length === 0 ? (
            <p className="no-data">No meetings assigned</p>
          ) : (
            <div className="meetings-list">
              {meetings.map(meeting => (
                <div key={meeting._id} className="meeting-item">
                  <h3>{meeting.title}</h3>
                  <p>{meeting.description}</p>
                  <p><strong>Date:</strong> {new Date(meeting.date).toLocaleDateString()} at {meeting.time}</p>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <motion.div 
        className="queries-section"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h2>💬 Queries & Answers</h2>
        
        <div className="post-query">
          <h3>Post a Query</h3>
          <form onSubmit={handlePostQuery}>
            <input
              type="text"
              placeholder="Query Title"
              value={newQuery.title}
              onChange={(e) => setNewQuery({ ...newQuery, title: e.target.value })}
              required
            />
            <textarea
              placeholder="Query Description"
              value={newQuery.description}
              onChange={(e) => setNewQuery({ ...newQuery, description: e.target.value })}
              required
            />
            <button type="submit">Post Query</button>
          </form>
        </div>

        <div className="queries-list">
          {queries.map(query => (
            <div key={query._id} className="query-item">
              <div className="query-header">
                <h3>{query.title}</h3>
                <div>
                  <span className={`status ${query.status}`}>{query.status}</span>
                  {query.postedByEmail === user?.email && (
                    <button 
                      onClick={() => handleDeleteQuery(query._id)} 
                      className="delete-query-btn"
                      title="Delete Query"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
              <p>{query.description}</p>
              <p className="query-meta">Posted by {query.postedBy} on {new Date(query.createdAt).toLocaleDateString()}</p>
              
              {query.answers.length > 0 && (
                <div className="answers">
                  <h4>Answers:</h4>
                  {query.answers.map((ans, idx) => (
                    <div key={idx} className="answer-item">
                      <p>{ans.answer}</p>
                      <p className="answer-meta">- {ans.answeredBy} ({new Date(ans.answeredAt).toLocaleDateString()})</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="answer-form">
                <input
                  type="text"
                  placeholder="Write your answer..."
                  value={answerText[query._id] || ''}
                  onChange={(e) => setAnswerText({ ...answerText, [query._id]: e.target.value })}
                />
                <button onClick={() => handleAnswerQuery(query._id)}>Post Answer</button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default UserDashboard;

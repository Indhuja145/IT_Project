import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import './Query.css';

function Query() {
  const [queries, setQueries] = useState([]);
  const [newQuery, setNewQuery] = useState({ title: '', description: '' });
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const userName = localStorage.getItem('userName') || 'User';

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/queries');
      setQueries(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch queries', err);
      setLoading(false);
    }
  };

  const handlePostQuery = async (e) => {
    e.preventDefault();
    if (!newQuery.title || !newQuery.description) {
      showNotification('Please fill all fields', 'error');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/add-query', {
        ...newQuery,
        postedBy: userName,
        postedByEmail: localStorage.getItem('userEmail') || 'user@example.com',
        postedAt: new Date()
      });
      showNotification('Query posted successfully', 'success');
      setNewQuery({ title: '', description: '' });
      fetchQueries();
    } catch (err) {
      showNotification('Failed to post query', 'error');
    }
  };

  const handlePostAnswer = async () => {
    if (!answer.trim()) {
      showNotification('Please enter an answer', 'error');
      return;
    }

    try {
      await axios.post(`http://localhost:5000/api/answer-query/${selectedQuery._id}`, {
        answer,
        answeredBy: userName,
        answeredByEmail: localStorage.getItem('userEmail') || 'user@example.com',
        answeredAt: new Date()
      });
      showNotification('Answer posted successfully', 'success');
      setAnswer('');
      setSelectedQuery(null);
      fetchQueries();
    } catch (err) {
      showNotification('Failed to post answer', 'error');
    }
  };

  const handleDeleteQuery = async (id) => {
    if (!window.confirm('Are you sure you want to delete this query?')) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/delete-query/${id}`);
      showNotification('Query deleted successfully', 'success');
      setSelectedQuery(null);
      fetchQueries();
    } catch (err) {
      showNotification('Failed to delete query', 'error');
    }
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  return (
    <div className="query-container">
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

      <div className="query-header">
        <h1>❓ Raise Query</h1>
        <p>Post your questions and get answers from the community</p>
      </div>

      <motion.div 
        className="post-query-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2>📝 Post New Query</h2>
        <form onSubmit={handlePostQuery}>
          <input
            type="text"
            placeholder="Query Title"
            value={newQuery.title}
            onChange={(e) => setNewQuery({ ...newQuery, title: e.target.value })}
            className="query-input"
          />
          <textarea
            placeholder="Describe your query in detail..."
            value={newQuery.description}
            onChange={(e) => setNewQuery({ ...newQuery, description: e.target.value })}
            className="query-textarea"
            rows="4"
          />
          <button type="submit" className="post-btn">Post Query</button>
        </form>
      </motion.div>

      <div className="queries-list">
        <h2>💬 All Queries</h2>
        {loading ? (
          <div className="loading">Loading queries...</div>
        ) : queries.length === 0 ? (
          <div className="no-data">No queries posted yet</div>
        ) : (
          queries.map((query) => (
            <motion.div
              key={query._id}
              className="query-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="query-header-info">
                <h3>{query.title}</h3>
                <span className="posted-by">Posted by: {query.postedBy}</span>
              </div>
              <p className="query-description">{query.description}</p>
              <div className="query-meta">
                <span className="query-date">
                  {new Date(query.postedAt).toLocaleDateString()}
                </span>
                <span className="answer-count">
                  {query.answers?.length || 0} Answers
                </span>
              </div>
              <button 
                className="view-query-btn"
                onClick={() => setSelectedQuery(query)}
              >
                View & Answer
              </button>
              <button 
                className="delete-query-btn"
                onClick={() => handleDeleteQuery(query._id)}
              >
                🗑️ Delete
              </button>
            </motion.div>
          ))
        )}
      </div>

      <AnimatePresence>
        {selectedQuery && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedQuery(null)}
          >
            <motion.div 
              className="modal-content query-modal"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2>{selectedQuery.title}</h2>
              <div className="modal-body">
                <div className="query-detail">
                  <strong>Posted by:</strong> {selectedQuery.postedBy}
                  <br />
                  <strong>Date:</strong> {new Date(selectedQuery.postedAt).toLocaleString()}
                </div>
                <div className="query-description-full">
                  <strong>Description:</strong>
                  <p>{selectedQuery.description}</p>
                </div>

                <div className="answers-section">
                  <h3>💡 Answers ({selectedQuery.answers?.length || 0})</h3>
                  {selectedQuery.answers?.length > 0 ? (
                    selectedQuery.answers.map((ans, index) => (
                      <div key={index} className="answer-card">
                        <p>{ans.answer}</p>
                        <div className="answer-meta">
                          <span>Answered by: {ans.answeredBy}</span>
                          <span>{new Date(ans.answeredAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="no-answers">No answers yet. Be the first to answer!</p>
                  )}
                </div>

                <div className="post-answer-section">
                  <h3>✍️ Post Your Answer</h3>
                  <textarea
                    placeholder="Write your answer here..."
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="answer-textarea"
                    rows="4"
                  />
                  <div className="modal-actions">
                    <button className="submit-answer-btn" onClick={handlePostAnswer}>
                      Submit Answer
                    </button>
                    <button className="modal-close-btn" onClick={() => setSelectedQuery(null)}>
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Query;

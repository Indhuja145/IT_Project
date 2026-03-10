import React from 'react';
import { motion } from 'framer-motion';
import './Reports.css';

function Reports() {
  const achievements = [
    { icon: '👥', number: '500+', label: 'Employees Managed' },
    { icon: '📋', number: '1000+', label: 'Requests Processed' },
    { icon: '🏢', number: '10+', label: 'Departments' },
    { icon: '⭐', number: '9', label: 'Years of Service' }
  ];

  return (
    <div className="reports-page">
      <motion.div 
        className="hero-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="hero-icon">💼</div>
        <h1>IT-MIS</h1>
        <p className="hero-subtitle">Information Management System</p>
      </motion.div>

      <motion.div 
        className="section-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2>🏢 Company Overview</h2>
        <p>
          IT-MIS (Information Management System) is designed to help organizations manage employees, 
          attendance, meetings, documents, and inventory efficiently in one centralized platform. 
          Our comprehensive solution streamlines organizational workflows and enhances productivity 
          through intelligent automation and real-time data management.
        </p>
      </motion.div>

      <motion.div 
        className="section-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2>📜 Company History</h2>
        <p>
          The company was established in 2015 with the aim of providing efficient digital management 
          solutions for organizations. Over the years, we have grown from a small startup to a trusted 
          partner for businesses seeking to modernize their management systems. Our journey has been 
          marked by continuous innovation and a commitment to excellence.
        </p>
      </motion.div>

      <div className="mission-vision-grid">
        <motion.div 
          className="section-card mission"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2>🎯 Mission</h2>
          <p>
            Our mission is to simplify organizational management through secure and efficient digital 
            systems. We strive to empower businesses with tools that enhance productivity, improve 
            communication, and streamline operations.
          </p>
        </motion.div>

        <motion.div 
          className="section-card vision"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2>🚀 Vision</h2>
          <p>
            Our vision is to become a leading provider of intelligent management systems for modern 
            workplaces. We aim to revolutionize how organizations operate by leveraging cutting-edge 
            technology and innovative solutions.
          </p>
        </motion.div>
      </div>

      <motion.div 
        className="achievements-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2>🏆 Achievements & Growth</h2>
        <div className="achievements-grid">
          {achievements.map((achievement, index) => (
            <motion.div
              key={index}
              className="achievement-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="achievement-icon">{achievement.icon}</div>
              <div className="achievement-number">{achievement.number}</div>
              <div className="achievement-label">{achievement.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div 
        className="report-footer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <p>© 2025 IT-MIS System. All Rights Reserved.</p>
        <p className="footer-subtitle">Developed for Academic Project</p>
      </motion.div>
    </div>
  );
}

export default Reports;

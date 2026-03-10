import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './Attendance.css';

function Attendance() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [monthFilter, setMonthFilter] = useState('');
  const [search, setSearch] = useState('');

  const stats = {
    totalDays: 22,
    present: 18,
    absent: 2,
    leave: 2
  };

  const attendanceData = [
    { date: '2024-03-01', checkIn: '09:00 AM', checkOut: '06:00 PM', hours: '9h', status: 'Present' },
    { date: '2024-03-02', checkIn: '09:15 AM', checkOut: '06:10 PM', hours: '8.9h', status: 'Late' },
    { date: '2024-03-03', checkIn: '-', checkOut: '-', hours: '-', status: 'Leave' },
    { date: '2024-03-04', checkIn: '09:00 AM', checkOut: '06:00 PM', hours: '9h', status: 'Present' },
    { date: '2024-03-05', checkIn: '-', checkOut: '-', hours: '-', status: 'Absent' }
  ];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);

  const getDateStatus = (day) => {
    const dayOfWeek = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) return 'weekend';
    if (day <= 5) return ['present', 'present', 'leave', 'present', 'absent'][day - 1];
    return 'present';
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleClockIn = () => {
    alert('Clocked In at ' + new Date().toLocaleTimeString());
  };

  const handleClockOut = () => {
    alert('Clocked Out at ' + new Date().toLocaleTimeString());
  };

  const downloadReport = () => {
    alert('Downloading attendance report...');
  };

  return (
    <div className="attendance-page">
      <div className="attendance-header">
        <h1>📅 Attendance Management</h1>
        <div className="header-actions">
          <button className="clock-btn clock-in" onClick={handleClockIn}>🕐 Clock In</button>
          <button className="clock-btn clock-out" onClick={handleClockOut}>🕐 Clock Out</button>
          <button className="download-btn" onClick={downloadReport}>⬇️ Download Report</button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <motion.div className="stat-card blue" whileHover={{ y: -5 }}>
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Total Working Days</h3>
            <p className="stat-number">{stats.totalDays}</p>
            <span className="stat-label">This month</span>
          </div>
        </motion.div>

        <motion.div className="stat-card green" whileHover={{ y: -5 }}>
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Days Present</h3>
            <p className="stat-number">{stats.present}</p>
            <span className="stat-label">{((stats.present/stats.totalDays)*100).toFixed(0)}% attendance</span>
          </div>
        </motion.div>

        <motion.div className="stat-card red" whileHover={{ y: -5 }}>
          <div className="stat-icon">❌</div>
          <div className="stat-content">
            <h3>Days Absent</h3>
            <p className="stat-number">{stats.absent}</p>
            <span className="stat-label">Unauthorized</span>
          </div>
        </motion.div>

        <motion.div className="stat-card orange" whileHover={{ y: -5 }}>
          <div className="stat-icon">🏖️</div>
          <div className="stat-content">
            <h3>Leave Days</h3>
            <p className="stat-number">{stats.leave}</p>
            <span className="stat-label">Approved leaves</span>
          </div>
        </motion.div>
      </div>

      {/* Calendar */}
      <div className="calendar-section">
        <div className="calendar-header">
          <h2>📆 Monthly Calendar</h2>
          <div className="month-navigation">
            <button onClick={previousMonth}>◀ Previous</button>
            <span>{currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
            <button onClick={nextMonth}>Next ▶</button>
          </div>
        </div>

        <div className="calendar-grid">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="calendar-day-header">{day}</div>
          ))}
          
          {[...Array(startingDayOfWeek)].map((_, i) => (
            <div key={`empty-${i}`} className="calendar-day empty"></div>
          ))}
          
          {[...Array(daysInMonth)].map((_, i) => {
            const day = i + 1;
            const status = getDateStatus(day);
            const isToday = day === new Date().getDate() && 
                           currentMonth.getMonth() === new Date().getMonth();
            
            return (
              <motion.div
                key={day}
                className={`calendar-day ${status} ${isToday ? 'today' : ''}`}
                whileHover={{ scale: 1.1 }}
                onClick={() => setSelectedDate(day)}
              >
                <span className="day-number">{day}</span>
                <span className="day-status">{status === 'present' ? '✓' : status === 'absent' ? '✗' : status === 'leave' ? '🏖️' : ''}</span>
              </motion.div>
            );
          })}
        </div>

        <div className="calendar-legend">
          <span><span className="legend-dot present"></span> Present</span>
          <span><span className="legend-dot absent"></span> Absent</span>
          <span><span className="legend-dot leave"></span> Leave</span>
          <span><span className="legend-dot weekend"></span> Weekend</span>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <select value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)}>
          <option value="">All Months</option>
          <option value="01">January</option>
          <option value="02">February</option>
          <option value="03">March</option>
        </select>
        <input type="date" placeholder="From Date" />
        <input type="date" placeholder="To Date" />
        <input 
          type="text" 
          placeholder="🔍 Search..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Attendance Table */}
      <div className="attendance-table-section">
        <h2>📋 Attendance Records</h2>
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Check-in Time</th>
              <th>Check-out Time</th>
              <th>Working Hours</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((record, index) => (
              <motion.tr 
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <td>{new Date(record.date).toLocaleDateString()}</td>
                <td>{record.checkIn}</td>
                <td>{record.checkOut}</td>
                <td>{record.hours}</td>
                <td>
                  <span className={`status-badge ${record.status.toLowerCase()}`}>
                    {record.status}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        
        <div className="pagination">
          <button>Previous</button>
          <span>Page 1 of 5</span>
          <button>Next</button>
        </div>
      </div>
    </div>
  );
}

export default Attendance;

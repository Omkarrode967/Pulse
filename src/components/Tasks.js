import React, { useEffect, useState, useCallback } from 'react';
import './Tasks.css';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import taskService from '../services/taskService';

function Tasks() {
  const { isDarkMode } = useTheme();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshInterval, setRefreshInterval] = useState(30000); // 30 seconds default

  const fetchTasks = useCallback(async () => {
    if (!user?.email) return;
    
    try {
      const fetchedTasks = await taskService.getUserTasks(user.email);
      setTasks(fetchedTasks);
      setError(null);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Filter tasks whenever tasks array or filter type changes
  const filterTasks = useCallback((tasksToFilter, filterType) => {
    switch (filterType) {
      case 'pending':
        return tasksToFilter.filter(task => !task.completed);
      case 'completed':
        return tasksToFilter.filter(task => task.completed);
      default:
        return tasksToFilter;
    }
  }, []);

  // Effect for initial fetch and polling
  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchTasks, refreshInterval]);

  // Effect for filtering tasks
  useEffect(() => {
    const filtered = filterTasks(tasks, filter);
    setFilteredTasks(filtered);
  }, [tasks, filter, filterTasks]);

  const handleSidebarToggle = (collapsed) => {
    setIsSidebarCollapsed(collapsed);
  };

  const getStatusColor = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const daysLeft = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) return 'text-red-600';
    if (daysLeft <= 3) return 'text-orange-500';
    return 'text-green-600';
  };

  if (!user) {
    return (
      <div className="tasks-page">
        <div className="tasks-container">
          <div className="error-state">
            <span className="error-icon">⚠️</span>
            <p>Please log in to view your tasks.</p>
            <button onClick={() => navigate('/login')} className="retry-button">
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`tasks-page ${isDarkMode ? 'dark' : ''}`}>
      <Navbar />
      <Sidebar onToggle={handleSidebarToggle} />
      <div className={`main-content ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <div className="tasks-container">
          <div className="tasks-header">
            <h2>My Tasks</h2>
            <div className="controls">
              <div className="filter-buttons">
                <button
                  className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                  onClick={() => setFilter('all')}
                >
                  All
                </button>
                <button
                  className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
                  onClick={() => setFilter('pending')}
                >
                  Pending
                </button>
                <button
                  className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
                  onClick={() => setFilter('completed')}
                >
                  Completed
                </button>
              </div>
              <select 
                value={refreshInterval} 
                onChange={(e) => setRefreshInterval(Number(e.target.value))}
                className="refresh-select"
              >
                <option value={5000}>5 seconds</option>
                <option value={15000}>15 seconds</option>
                <option value={30000}>30 seconds</option>
                <option value={60000}>1 minute</option>
              </select>
              <button onClick={fetchTasks} className="refresh-button">
                Refresh Now
              </button>
            </div>
          </div>

          {loading ? (
            <div className="loading-tasks">
              <div className="loading-spinner"></div>
              <p>Loading your tasks...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <span className="error-icon">⚠️</span>
              <p>{error}</p>
              <button onClick={fetchTasks} className="retry-button">
                Try Again
              </button>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="no-tasks">
              <span className="no-tasks-icon">📋</span>
              <h3>No tasks found</h3>
              <p>
                {filter === 'all'
                  ? 'You have no tasks assigned yet.'
                  : filter === 'pending'
                  ? 'You have no pending tasks.'
                  : 'You have no completed tasks.'}
              </p>
            </div>
          ) : (
            <div className="tasks-list">
              {filteredTasks.map(task => (
                <div key={task.id} className="task-card">
                  <div className="task-header">
                    <h3>{task.title}</h3>
                    <span className={`status-badge ${task.completed ? 'completed' : 'pending'}`}>
                      {task.completed ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                  <p className="task-description">{task.description}</p>
                  <div className="task-meta">
                    <div className="deadline">
                      <span className="label">Deadline:</span>
                      <span className={`date ${getStatusColor(task.deadline)}`}>
                        {new Date(task.deadline).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="project">
                      <span className="label">Project:</span>
                      <span className="project-name">{task.projectName}</span>
                    </div>
                  </div>
                  <div className="task-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${task.progress || 0}%` }}
                      ></div>
                    </div>
                    <span className="progress-text">{task.progress || 0}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Tasks; 
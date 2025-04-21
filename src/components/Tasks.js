import React, { useEffect, useState, useCallback } from 'react';
import { useWebSocket } from '../services/websocket';
import './Tasks.css';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

function Tasks() {
  const { isDarkMode } = useTheme();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('currentUser'));
  const { tasks } = useWebSocket(user?.id);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [filter, setFilter] = useState('all'); // all, pending, completed

  const filterTasks = useCallback((filterType) => {
    switch (filterType) {
      case 'pending':
        setFilteredTasks(tasks.filter(task => !task.completed));
        break;
      case 'completed':
        setFilteredTasks(tasks.filter(task => task.completed));
        break;
      default:
        setFilteredTasks(tasks);
    }
  }, [tasks]);

  useEffect(() => {
    filterTasks(filter);
  }, [tasks, filter, filterTasks]);

  const handleSidebarToggle = (collapsed) => {
    setIsSidebarCollapsed(collapsed);
  };

  const getStatusColor = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const daysLeft = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) return 'red';
    if (daysLeft <= 3) return 'orange';
    return 'green';
  };

  if (!user) {
    return <div className="tasks-container">Please log in to view your tasks.</div>;
  }

  return (
    <div className={`tasks-page ${isDarkMode ? 'dark' : ''}`}>
      <Navbar />
      <Sidebar onToggle={handleSidebarToggle} />
      <div className={`main-content ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <div className="tasks-container">
          <div className="tasks-header">
            <h2>My Tasks</h2>
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
          </div>

          <div className="tasks-list">
            {filteredTasks.length === 0 ? (
              <div className="no-tasks">No tasks found</div>
            ) : (
              filteredTasks.map(task => (
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
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tasks; 
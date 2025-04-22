import React, { useEffect, useState } from 'react';
import './TaskPrioritization.css';
import taskPrioritizationService from '../services/taskPrioritizationService';
import { useAuth } from '../contexts/AuthContext';
import initialTasks from '../data/initialTasks';

const TaskPrioritization = () => {
  const { currentUser } = useAuth();
  const [prioritizedTasks, setPrioritizedTasks] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [viewType, setViewType] = useState('hybrid'); // 'personal', 'team', or 'hybrid'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTasks = async () => {
      setLoading(true);
      try {
        const context = {
          user: currentUser,
          team: currentUser.team,
          viewType
        };

        let tasks = initialTasks;
        
        // Filter tasks based on view type
        if (viewType === 'personal') {
          tasks = tasks.filter(task => task.assignedTo === currentUser.email);
        } else if (viewType === 'team') {
          tasks = tasks.filter(task => task.teamId === currentUser.team.id);
        }

        const prioritized = await taskPrioritizationService.prioritizeTasks(tasks, context);
        setPrioritizedTasks(prioritized);
      } catch (error) {
        console.error('Error prioritizing tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [currentUser, viewType]);

  const getPriorityBadgeStyle = (color) => ({
    backgroundColor: color,
    color: 'white',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '0.875rem'
  });

  const filterTasks = (tasks) => {
    switch (selectedFilter) {
      case 'critical':
        return tasks.filter(task => task.priority.label === 'Critical');
      case 'high':
        return tasks.filter(task => task.priority.label === 'High');
      case 'medium':
        return tasks.filter(task => task.priority.label === 'Medium');
      case 'low':
        return tasks.filter(task => task.priority.label === 'Low');
      default:
        return tasks;
    }
  };

  const getAssigneeName = (email) => {
    const member = currentUser.team.members.find(m => m.email === email) || 
                  (currentUser.team.leader.email === email ? currentUser.team.leader : null);
    return member ? member.name : email;
  };

  if (loading) {
    return <div className="task-prioritization">
      <div className="loading-state">Loading tasks...</div>
    </div>;
  }

  return (
    <div className="task-prioritization">
      <div className="header-container">
        <h2 className="title">Task Prioritization</h2>
        <div className="view-controls">
          <div className="filter-controls">
            <button
              onClick={() => setViewType('personal')}
              className={`view-button ${viewType === 'personal' ? 'active' : ''}`}
            >
              My Tasks
            </button>
            <button
              onClick={() => setViewType('team')}
              className={`view-button ${viewType === 'team' ? 'active' : ''}`}
            >
              Team Tasks
            </button>
            <button
              onClick={() => setViewType('hybrid')}
              className={`view-button ${viewType === 'hybrid' ? 'active' : ''}`}
            >
              Hybrid View
            </button>
          </div>
          <div className="filter-controls">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`filter-button ${selectedFilter === 'all' ? 'active' : ''}`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedFilter('critical')}
              className={`filter-button critical ${selectedFilter === 'critical' ? 'active' : ''}`}
            >
              Critical
            </button>
            <button
              onClick={() => setSelectedFilter('high')}
              className={`filter-button high ${selectedFilter === 'high' ? 'active' : ''}`}
            >
              High
            </button>
            <button
              onClick={() => setSelectedFilter('medium')}
              className={`filter-button medium ${selectedFilter === 'medium' ? 'active' : ''}`}
            >
              Medium
            </button>
            <button
              onClick={() => setSelectedFilter('low')}
              className={`filter-button low ${selectedFilter === 'low' ? 'active' : ''}`}
            >
              Low
            </button>
          </div>
        </div>
      </div>

      <div className="tasks-container">
        {filterTasks(prioritizedTasks).map((task) => (
          <div key={task.id} className="task-card">
            <div className="task-header">
              <div className="task-title-section">
                <h3 className="task-title">{task.title}</h3>
                <span style={getPriorityBadgeStyle(task.priority.color)}>
                  {task.priority.label} ({Math.round(task.priority.score)})
                </span>
                {viewType === 'hybrid' && (
                  <span className="task-type-badge">
                    {task.assignedTo === currentUser.email ? 'Personal' : 'Team'}
                  </span>
                )}
              </div>
            </div>
            
            <p className="task-description">{task.description}</p>
            
            <div className="task-details-grid">
              <div className="detail-group">
                <div className="detail-item">
                  <span className="detail-label">Assigned to:</span>
                  <span className="detail-value">{getAssigneeName(task.assignedTo)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Due Date:</span>
                  <span className={`detail-value ${
                    new Date(task.dueDate) <= new Date() ? 'overdue' : ''
                  }`}>
                    {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Complexity:</span>
                  <span className="detail-value">{task.complexity}</span>
                </div>
              </div>
              <div className="detail-group">
                <div className="detail-item">
                  <span className="detail-label">Status:</span>
                  <span className={`status-badge ${task.status}`}>
                    {task.status}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Estimated:</span>
                  <span className="detail-value">{task.estimatedHours}h</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Dependencies:</span>
                  <span className="detail-value">{task.dependencies.length} tasks</span>
                </div>
              </div>
            </div>

            {task.priorityDetails.length > 0 && (
              <div className="priority-factors">
                <p className="factors-title">AI Priority Factors:</p>
                <ul className="factors-list">
                  {task.priorityDetails.map((detail, index) => (
                    <li key={index} className="factor-item">
                      <svg className="factor-icon" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                      </svg>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskPrioritization; 
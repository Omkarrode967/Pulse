import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import aiTaskPrioritization from '../services/aiTaskPrioritization';
import './TaskManagement.css';

const TaskManagement = () => {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [viewMode, setViewMode] = useState('hybrid'); // 'personal', 'team', or 'hybrid'
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [userTeams, setUserTeams] = useState([]);
  const [prioritizationDetails, setPrioritizationDetails] = useState({});
  const [isAIPrioritizing, setIsAIPrioritizing] = useState(false);

  useEffect(() => {
    // Load user's teams
    const loadUserTeams = async () => {
      try {
        // Get teams from localStorage for now
        const teams = JSON.parse(localStorage.getItem('teams')) || [];
        const userTeams = teams.filter(team => 
          team.members.some(member => member.email === currentUser.email) ||
          team.leader.email === currentUser.email
        );
        setUserTeams(userTeams);
        if (userTeams.length > 0) {
          setSelectedTeam(userTeams[0]);
        }
      } catch (error) {
        console.error('Error loading teams:', error);
      }
    };

    loadUserTeams();
  }, [currentUser]);

  useEffect(() => {
    const loadTasks = async () => {
      setLoading(true);
      try {
        // Get tasks from localStorage for now
        const allTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        
        let filteredTasks = [];
        switch (viewMode) {
          case 'personal':
            filteredTasks = allTasks.filter(task => task.assignedTo === currentUser.email);
            break;
          case 'team':
            if (selectedTeam) {
              filteredTasks = allTasks.filter(task => task.teamId === selectedTeam.id);
            }
            break;
          case 'hybrid':
            filteredTasks = allTasks.filter(task => 
              task.assignedTo === currentUser.email || 
              (selectedTeam && task.teamId === selectedTeam.id)
            );
            break;
          default:
            filteredTasks = allTasks;
        }

        // Sort tasks by priority and deadline
        filteredTasks.sort((a, b) => {
          if (a.priority !== b.priority) {
            return b.priority - a.priority; // Higher priority first
          }
          return new Date(a.deadline) - new Date(b.deadline); // Earlier deadline first
        });

        setTasks(filteredTasks);
      } catch (error) {
        console.error('Error loading tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [currentUser, viewMode, selectedTeam]);

  useEffect(() => {
    if (tasks.length > 0 && currentUser) {
      updateTaskPriorities();
    }
  }, [tasks, currentUser]);

  const updateTaskPriorities = async () => {
    setIsAIPrioritizing(true);
    try {
      const context = {
        teamWorkload: calculateTeamWorkload(),
        currentSprint: getCurrentSprintInfo(),
        organizationalPriorities: getOrganizationalPriorities()
      };

      const prioritizedTasks = await aiTaskPrioritization.prioritizeTasks(tasks, currentUser, context);
      
      // Update tasks with new priorities
      setTasks(prioritizedTasks);
      
      // Store prioritization details for UI display
      const details = {};
      prioritizedTasks.forEach(task => {
        details[task.id] = {
          skillMatch: task.priority.skillMatch,
          deadlineUrgency: task.priority.deadlineUrgency,
          explanation: task.priority.explanation
        };
      });
      setPrioritizationDetails(details);
    } catch (error) {
      console.error('Error prioritizing tasks:', error);
    } finally {
      setIsAIPrioritizing(false);
    }
  };

  const renderPriorityExplanation = (task) => {
    const details = prioritizationDetails[task.id];
    if (!details) return null;

    return (
      <div className="priority-explanation">
        {details.explanation.map((item, index) => (
          <div key={index} className={`explanation-item ${item.type}`}>
            <strong>{item.message}</strong>
            <ul>
              {item.details.map((detail, i) => (
                <li key={i}>{detail}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  };

  const renderTaskCard = (task) => {
    return (
      <div className="task-card" key={task.id}>
        <div className="task-header">
          <h3>{task.title}</h3>
          <span className={`priority-badge ${task.priority.enhancedScore >= 80 ? 'high' : task.priority.enhancedScore >= 50 ? 'medium' : 'low'}`}>
            Priority Score: {Math.round(task.priority.enhancedScore)}
          </span>
        </div>
        <div className="task-details">
          <p>{task.description}</p>
          <div className="task-metadata">
            <span>Due: {new Date(task.deadline).toLocaleDateString()}</span>
            <span>Complexity: {task.complexity}</span>
          </div>
          {renderPriorityExplanation(task)}
        </div>
      </div>
    );
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 3: return { label: 'High', color: '#ef4444' };
      case 2: return { label: 'Medium', color: '#f97316' };
      case 1: return { label: 'Low', color: '#22c55e' };
      default: return { label: 'None', color: '#6b7280' };
    }
  };

  const getStatusColor = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const daysLeft = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) return 'text-red-600';
    if (daysLeft <= 3) return 'text-orange-500';
    return 'text-green-600';
  };

  if (loading) {
    return <div className="task-management">Loading tasks...</div>;
  }

  return (
    <div className="task-management">
      <div className="header">
        <h2 className="title">Task Management</h2>
        <div className="controls">
          <div className="view-selector">
            <button
              className={`view-btn ${viewMode === 'personal' ? 'active' : ''}`}
              onClick={() => setViewMode('personal')}
            >
              My Tasks
            </button>
            <button
              className={`view-btn ${viewMode === 'team' ? 'active' : ''}`}
              onClick={() => setViewMode('team')}
            >
              Team Tasks
            </button>
            <button
              className={`view-btn ${viewMode === 'hybrid' ? 'active' : ''}`}
              onClick={() => setViewMode('hybrid')}
            >
              All Tasks
            </button>
          </div>
          {(viewMode === 'team' || viewMode === 'hybrid') && (
            <select
              className="team-selector"
              value={selectedTeam?.id || ''}
              onChange={(e) => {
                const team = userTeams.find(t => t.id === e.target.value);
                setSelectedTeam(team);
              }}
            >
              {userTeams.map(team => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="tasks-container">
        {isAIPrioritizing && (
          <div className="ai-prioritizing">
            <div className="spinner"></div>
            <p>AI is analyzing and prioritizing tasks...</p>
          </div>
        )}
        {tasks.length === 0 ? (
          <div className="no-tasks">
            {viewMode === 'personal' ? 'You have no tasks assigned.' :
             viewMode === 'team' ? 'No tasks found for this team.' :
             'No tasks found.'}
          </div>
        ) : (
          tasks.map(renderTaskCard)
        )}
      </div>
    </div>
  );
};

export default TaskManagement; 
import React, { useEffect, useState } from 'react';
import taskPrioritizationService from '../services/taskPrioritizationService';
import team from '../data/teamConfig';
import initialTasks from '../data/initialTasks';

const TaskPrioritization = () => {
  const [prioritizedTasks, setPrioritizedTasks] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    const tasks = taskPrioritizationService.prioritizeTasks(initialTasks, team);
    setPrioritizedTasks(tasks);
  }, []);

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
    const member = team.members.find(m => m.email === email) || 
                  (team.leader.email === email ? team.leader : null);
    return member ? member.name : email;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Task Prioritization</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-4 py-2 rounded-lg ${
              selectedFilter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setSelectedFilter('critical')}
            className={`px-4 py-2 rounded-lg ${
              selectedFilter === 'critical'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Critical
          </button>
          <button
            onClick={() => setSelectedFilter('high')}
            className={`px-4 py-2 rounded-lg ${
              selectedFilter === 'high'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            High
          </button>
          <button
            onClick={() => setSelectedFilter('medium')}
            className={`px-4 py-2 rounded-lg ${
              selectedFilter === 'medium'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Medium
          </button>
          <button
            onClick={() => setSelectedFilter('low')}
            className={`px-4 py-2 rounded-lg ${
              selectedFilter === 'low'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Low
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filterTasks(prioritizedTasks).map((task) => (
          <div
            key={task.id}
            className="bg-white rounded-lg shadow p-6 border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold">{task.title}</h3>
                  <span style={getPriorityBadgeStyle(task.priority.color)}>
                    {task.priority.label} ({Math.round(task.priority.score)})
                  </span>
                </div>
                <p className="text-gray-600 mt-2">{task.description}</p>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="flex items-center gap-2">
                  <span className="font-medium min-w-32">Assigned to:</span>
                  <span className="text-blue-600">{getAssigneeName(task.assignedTo)}</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-medium min-w-32">Due Date:</span>
                  <span className={`${
                    new Date(task.dueDate) <= new Date() ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-medium min-w-32">Complexity:</span>
                  <span className="capitalize">{task.complexity}</span>
                </p>
              </div>
              <div className="space-y-2">
                <p className="flex items-center gap-2">
                  <span className="font-medium min-w-32">Status:</span>
                  <span className={`capitalize px-2 py-1 rounded-full text-sm ${
                    task.status === 'completed' ? 'bg-green-100 text-green-800' :
                    task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {task.status}
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-medium min-w-32">Estimated:</span>
                  <span>{task.estimatedHours}h</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-medium min-w-32">Dependencies:</span>
                  <span>{task.dependencies.length} tasks</span>
                </p>
              </div>
            </div>

            {task.priorityDetails.length > 0 && (
              <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                <p className="font-medium text-sm text-gray-700">Priority Factors:</p>
                <ul className="mt-2 space-y-1">
                  {task.priorityDetails.map((detail, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
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
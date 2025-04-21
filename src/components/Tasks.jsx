import React, { useState, useEffect } from 'react';
import taskPrioritizationService from '../services/taskPrioritizationService';
import { userProfile } from '../models/UserProfile';
import { TASK_STATUS } from '../models/Task';

// Sample tasks for demonstration
const sampleTasks = [
  {
    id: 't1',
    title: 'Set up data collection pipeline',
    description: 'Create automated scripts for data collection from various sources',
    assignedTo: 'omkarrode967@gmail.com',
    createdBy: 'jatin.22211054@viit.ac.in',
    deadline: new Date('2024-03-25'),
    estimatedHours: 20,
    complexity: 4,
    requiredSkills: {
      'data-collection': 4,
      'python': 3
    },
    dependencies: [],
    status: TASK_STATUS.IN_PROGRESS,
    progress: 30
  },
  {
    id: 't2',
    title: 'Data preprocessing implementation',
    description: 'Implement data cleaning and preprocessing pipeline',
    assignedTo: 'omkarrode967@gmail.com',
    createdBy: 'jatin.22211054@viit.ac.in',
    deadline: new Date('2024-03-20'),
    estimatedHours: 15,
    complexity: 3,
    requiredSkills: {
      'data-preprocessing': 4,
      'python': 3
    },
    dependencies: ['t1'],
    status: TASK_STATUS.NOT_STARTED,
    progress: 0
  }
  // Add more sample tasks as needed
];

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    // In a real app, you would fetch tasks from an API
    const prioritizedTasks = taskPrioritizationService.prioritizeUserTasks(sampleTasks, userProfile);
    setTasks(prioritizedTasks);
  }, []);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case TASK_STATUS.COMPLETED:
        return 'bg-green-100 text-green-800';
      case TASK_STATUS.IN_PROGRESS:
        return 'bg-blue-100 text-blue-800';
      case TASK_STATUS.BLOCKED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityBadgeClass = (score) => {
    const { color } = taskPrioritizationService.getPriorityLevel(score);
    return `bg-opacity-10 text-opacity-100 bg-${color} text-${color}`;
  };

  const filteredTasks = tasks.filter(task => {
    if (filterStatus === 'all') return true;
    return task.status === filterStatus;
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Tasks</h1>
        <div className="flex gap-3">
          <select
            className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value={TASK_STATUS.NOT_STARTED}>Not Started</option>
            <option value={TASK_STATUS.IN_PROGRESS}>In Progress</option>
            <option value={TASK_STATUS.BLOCKED}>Blocked</option>
            <option value={TASK_STATUS.COMPLETED}>Completed</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredTasks.map(task => (
          <div
            key={task.id}
            className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
            onClick={() => setSelectedTask(task.id === selectedTask?.id ? null : task)}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold">{task.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(task.status)}`}>
                    {task.status.replace('_', ' ')}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-sm font-medium ${getPriorityBadgeClass(task.priorityScore)}`}>
                    {taskPrioritizationService.getPriorityLevel(task.priorityScore).label}
                  </span>
                </div>
                <p className="text-gray-600 mt-1">{task.description}</p>
              </div>
            </div>

            {selectedTask?.id === task.id && (
              <div className="mt-4 border-t pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-2">Priority Factors</h4>
                    <div className="space-y-2">
                      {Object.entries(task.priorityFactors).map(([factor, score]) => (
                        <div key={factor} className="flex items-center gap-2">
                          <div className="text-sm text-gray-600 capitalize">{factor}:</div>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full">
                            <div
                              className="h-2 bg-blue-600 rounded-full"
                              style={{ width: `${score}%` }}
                            />
                          </div>
                          <div className="text-sm text-gray-600">{Math.round(score)}%</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-2">Task Details</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Deadline:</span> {new Date(task.deadline).toLocaleDateString()}</p>
                      <p><span className="font-medium">Estimated Hours:</span> {task.estimatedHours}h</p>
                      <p><span className="font-medium">Progress:</span> {task.progress}%</p>
                      <p><span className="font-medium">Dependencies:</span> {task.dependencies.length} tasks</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks; 
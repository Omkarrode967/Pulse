import React, { useState } from 'react';
import TaskPrioritization from './TaskPrioritization';

const TaskManagement = () => {
  const [showPrioritization, setShowPrioritization] = useState(false);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">VIIT Chatbot Project Tasks</h1>
        <button
          onClick={() => setShowPrioritization(!showPrioritization)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {showPrioritization ? 'Hide Task Prioritization' : 'Show Task Prioritization'}
        </button>
      </div>

      {/* Animated container for TaskPrioritization */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          showPrioritization ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-gray-50 rounded-lg shadow-lg border border-gray-200">
          <TaskPrioritization />
        </div>
      </div>

      {/* Your existing task list or other components can go here */}
      <div className="mt-6">
        {/* This is a placeholder for your existing task list view */}
        {!showPrioritization && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Current Tasks</h2>
            {/* Your existing task list content */}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskManagement; 
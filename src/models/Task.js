// Task complexity levels
export const COMPLEXITY_LEVELS = {
  VERY_HIGH: 5,
  HIGH: 4,
  MEDIUM: 3,
  LOW: 2,
  VERY_LOW: 1
};

// Task urgency levels based on deadline
export const URGENCY_LEVELS = {
  IMMEDIATE: 5,  // Due within 24 hours
  URGENT: 4,     // Due within 3 days
  NORMAL: 3,     // Due within a week
  LOW: 2,        // Due within 2 weeks
  FLEXIBLE: 1    // Due beyond 2 weeks
};

// Task status
export const TASK_STATUS = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  BLOCKED: 'blocked',
  COMPLETED: 'completed'
};

// Sample task structure
export const taskModel = {
  id: 'task123',
  title: '',
  description: '',
  assignedTo: '', // User email
  createdBy: '',
  createdAt: new Date(),
  deadline: new Date(),
  estimatedHours: 0,
  
  // Priority factors
  complexity: COMPLEXITY_LEVELS.MEDIUM,
  requiredSkills: {
    // skill: required level (using SKILL_LEVELS)
    'python': 3,
    'data-collection': 4
  },
  
  // Dependencies
  dependencies: [], // Array of task IDs that must be completed before this task
  blockedBy: [], // Array of task IDs currently blocking this task
  
  // Progress tracking
  status: TASK_STATUS.NOT_STARTED,
  progress: 0, // 0-100
  actualHours: 0,
  
  // Priority score (calculated based on multiple factors)
  priorityScore: 0,
  priorityFactors: {
    skillMatch: 0,      // 0-100: How well the assigned user's skills match requirements
    urgency: 0,         // 0-100: Based on deadline proximity
    complexity: 0,      // 0-100: Task complexity score
    dependency: 0,      // 0-100: Whether dependencies are met
    availability: 0     // 0-100: Assigned user's availability
  }
}; 
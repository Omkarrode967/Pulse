// Skill levels
export const SKILL_LEVELS = {
  EXPERT: 5,
  ADVANCED: 4,
  INTERMEDIATE: 3,
  BASIC: 2,
  BEGINNER: 1
};

// Sample user profile structure
export const userProfile = {
  id: 'user123',
  name: 'Omkar Rode',
  email: 'omkarrode967@gmail.com',
  role: 'Data Collection Specialist',
  skills: {
    'data-collection': SKILL_LEVELS.EXPERT,
    'python': SKILL_LEVELS.ADVANCED,
    'ml': SKILL_LEVELS.INTERMEDIATE,
    'data-preprocessing': SKILL_LEVELS.ADVANCED,
    'project-management': SKILL_LEVELS.INTERMEDIATE
  },
  availability: {
    maxHoursPerWeek: 40,
    currentTasksHours: 0, // This will be calculated based on assigned tasks
    preferredWorkingHours: {
      start: '09:00',
      end: '17:00'
    }
  },
  currentTasks: [] // Will store IDs of assigned tasks
}; 
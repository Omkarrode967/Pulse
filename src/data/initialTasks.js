const initialTasks = [
  {
    id: 1,
    title: 'Data Collection Setup',
    description: 'Set up data collection pipeline and identify data sources for chatbot training',
    assignedTo: 'omkarrode967@gmail.com',
    startDate: '2024-03-15',
    dueDate: '2024-03-25',
    complexity: 'high',
    estimatedHours: 20,
    requiredSkills: ['data-collection', 'project-management'],
    dependencies: [],
    status: 'in-progress',
    tags: ['data-collection', 'project-management', 'team-coordination'],
    teamId: 'viit-chatbot-team'
  },
  {
    id: 2,
    title: 'Data Cleaning Pipeline',
    description: 'Develop and implement data cleaning procedures for collected data',
    assignedTo: 'shaileshnagargoje45@gmail.com',
    startDate: '2024-03-20',
    dueDate: '2024-03-30',
    complexity: 'medium',
    estimatedHours: 25,
    requiredSkills: ['data-cleaning', 'python'],
    dependencies: [{ id: 1, completed: false }],
    status: 'pending',
    tags: ['data-cleaning', 'data-quality', 'data-preprocessing'],
    teamId: 'viit-chatbot-team'
  },
  {
    id: 3,
    title: 'Feature Engineering',
    description: 'Design and implement features for the chatbot model',
    assignedTo: 'atharva.22311496@viit.ac.in',
    startDate: '2024-03-25',
    dueDate: '2024-04-05',
    complexity: 'very high',
    estimatedHours: 30,
    requiredSkills: ['feature-engineering', 'ml'],
    dependencies: [{ id: 2, completed: false }],
    status: 'pending',
    tags: ['feature-engineering', 'ml'],
    teamId: 'viit-chatbot-team'
  },
  {
    id: 4,
    title: 'Model Training',
    description: 'Train the chatbot model using prepared dataset',
    assignedTo: 'akash.22210389@viit.ac.in',
    startDate: '2024-04-01',
    dueDate: '2024-04-15',
    complexity: 'very high',
    estimatedHours: 40,
    requiredSkills: ['ml', 'model-training'],
    dependencies: [{ id: 3, completed: false }],
    status: 'pending',
    tags: ['ml', 'model-training', 'deep-learning'],
    teamId: 'viit-chatbot-team'
  },
  {
    id: 5,
    title: 'Model Evaluation',
    description: 'Evaluate model performance and implement improvements',
    assignedTo: 'jatin.22211054@viit.ac.in',
    startDate: '2024-04-10',
    dueDate: '2024-04-20',
    complexity: 'high',
    estimatedHours: 25,
    requiredSkills: ['model-evaluation', 'testing'],
    dependencies: [{ id: 4, completed: false }],
    status: 'pending',
    tags: ['model-evaluation', 'testing', 'performance-optimization'],
    teamId: 'viit-chatbot-team'
  }
];

export default initialTasks; 
const team = {
  name: 'VIIT Chatbot Team',
  id: 'viit-chatbot-team',
  goals: [
    {
      id: 1,
      title: 'Complete Data Pipeline',
      description: 'Establish end-to-end data collection and processing pipeline',
      keywords: ['data-collection', 'data-cleaning', 'data-preprocessing'],
      deadline: '2024-03-30',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Model Development',
      description: 'Develop and train initial chatbot model',
      keywords: ['feature-engineering', 'ml', 'model-training'],
      deadline: '2024-04-15',
      priority: 'critical'
    },
    {
      id: 3,
      title: 'Model Evaluation',
      description: 'Complete comprehensive model evaluation',
      keywords: ['model-evaluation', 'testing', 'performance-optimization'],
      deadline: '2024-04-20',
      priority: 'high'
    }
  ],
  leader: {
    name: 'Omkar Rode',
    email: 'omkarrode967@gmail.com',
    role: 'Team Lead',
    skills: ['project-management', 'data-collection', 'ml'],
    personalGoals: [
      {
        id: 1,
        title: 'Project Management',
        description: 'Ensure smooth project execution and team coordination',
        keywords: ['project-management', 'team-coordination'],
        deadline: '2024-04-20',
        priority: 'high'
      }
    ]
  },
  members: [
    {
      name: 'Shailesh nagargoje',
      email: 'shaileshnagargoje45@gmail.com',
      role: 'Data Cleaning Specialist',
      skills: ['data-cleaning', 'data-preprocessing', 'python'],
      personalGoals: [
        {
          id: 1,
          title: 'Data Quality',
          description: 'Ensure high-quality data processing',
          keywords: ['data-cleaning', 'data-quality'],
          deadline: '2024-03-30',
          priority: 'high'
        }
      ]
    },
    {
      name: 'Atharva Joshi',
      email: 'atharva.22311496@viit.ac.in',
      role: 'Feature Engineer',
      skills: ['feature-engineering', 'ml', 'python'],
      personalGoals: [
        {
          id: 1,
          title: 'Feature Development',
          description: 'Develop innovative features for the model',
          keywords: ['feature-engineering', 'ml'],
          deadline: '2024-04-05',
          priority: 'high'
        }
      ]
    },
    {
      name: 'Akash Ganggurde',
      email: 'akash.22210389@viit.ac.in',
      role: 'ML Engineer',
      skills: ['ml', 'model-training', 'deep-learning'],
      personalGoals: [
        {
          id: 1,
          title: 'Model Training',
          description: 'Achieve optimal model performance',
          keywords: ['ml', 'model-training'],
          deadline: '2024-04-15',
          priority: 'critical'
        }
      ]
    },
    {
      name: 'Jatin sathe',
      email: 'jatin.22211054@viit.ac.in',
      role: 'Evaluation Specialist',
      skills: ['model-evaluation', 'testing', 'performance-optimization'],
      personalGoals: [
        {
          id: 1,
          title: 'Model Evaluation',
          description: 'Complete comprehensive model evaluation',
          keywords: ['model-evaluation', 'testing'],
          deadline: '2024-04-20',
          priority: 'high'
        }
      ]
    }
  ]
};

export default team; 
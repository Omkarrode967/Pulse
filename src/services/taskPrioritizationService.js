import { URGENCY_LEVELS } from '../models/Task';
import { SKILL_LEVELS } from '../models/UserProfile';

// Task Priority Weights
const PRIORITY_WEIGHTS = {
  DEADLINE: 0.4,
  COMPLEXITY: 0.2,
  DEPENDENCIES: 0.15,
  AVAILABILITY: 0.15,
  SKILL_MATCH: 0.1
};

// Priority Levels
const PRIORITY_LEVELS = {
  CRITICAL: { score: 90, label: 'Critical', color: '#ef4444' },
  HIGH: { score: 75, label: 'High', color: '#f97316' },
  MEDIUM: { score: 50, label: 'Medium', color: '#eab308' },
  LOW: { score: 25, label: 'Low', color: '#22c55e' }
};

class TaskPrioritizationService {
  // Weight factors for priority calculation
  static WEIGHTS = {
    SKILL_MATCH: 0.25,    // How well user skills match task requirements
    URGENCY: 0.30,        // Deadline proximity
    COMPLEXITY: 0.20,     // Task complexity
    DEPENDENCY: 0.15,     // Whether dependencies are met
    AVAILABILITY: 0.10    // User's current workload
  };

  calculateDeadlineScore(dueDate) {
    const now = new Date();
    const deadline = new Date(dueDate);
    const daysUntilDeadline = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));

    if (daysUntilDeadline <= 0) return 100; // Overdue
    if (daysUntilDeadline <= 1) return 95; // Due today or tomorrow
    if (daysUntilDeadline <= 3) return 85; // Due within 3 days
    if (daysUntilDeadline <= 7) return 70; // Due within a week
    if (daysUntilDeadline <= 14) return 50; // Due within 2 weeks
    if (daysUntilDeadline <= 30) return 30; // Due within a month
    return 20; // Due in more than a month
  }

  calculateComplexityScore(complexity) {
    switch (complexity?.toLowerCase()) {
      case 'very high': return 100;
      case 'high': return 80;
      case 'medium': return 60;
      case 'low': return 40;
      case 'very low': return 20;
      default: return 50;
    }
  }

  calculateDependencyScore(dependencies = []) {
    if (!dependencies.length) return 0;
    
    const blockedTasks = dependencies.filter(dep => !dep.completed).length;
    const completedTasks = dependencies.filter(dep => dep.completed).length;
    
    if (blockedTasks === 0) return 100; // All dependencies met
    if (completedTasks === 0) return 0; // No dependencies met
    
    return (completedTasks / dependencies.length) * 100;
  }

  calculateAvailabilityScore(assignee, startDate) {
    // Get assignee's tasks for the week of the start date
    const weekStart = new Date(startDate);
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    // Get tasks from localStorage
    const assigneeTasks = this.getAssigneeTasks(assignee.email, weekStart, weekEnd);
    
    // Calculate workload percentage (assuming 40 hours work week)
    const totalHours = assigneeTasks.reduce((sum, task) => sum + (task.estimatedHours || 0), 0);
    const availabilityPercentage = Math.max(0, 100 - ((totalHours / 40) * 100));
    
    return availabilityPercentage;
  }

  calculateSkillMatchScore(task, assignee) {
    if (!task.requiredSkills || !assignee.skills) return 50; // Default score if skills not specified

    const matchingSkills = task.requiredSkills.filter(
      skill => assignee.skills.includes(skill)
    ).length;

    return (matchingSkills / task.requiredSkills.length) * 100;
  }

  getAssigneeTasks(assigneeEmail, startDate, endDate) {
    const tasks = [];
    const projectKeys = Object.keys(localStorage).filter(key => key.startsWith('project_'));

    projectKeys.forEach(key => {
      try {
        const project = JSON.parse(localStorage.getItem(key));
        if (project && project.tasks) {
          const assigneeTasks = project.tasks.filter(task => 
            task.assignedTo === assigneeEmail &&
            new Date(task.startDate) >= startDate &&
            new Date(task.startDate) <= endDate
          );
          tasks.push(...assigneeTasks);
        }
      } catch (error) {
        console.error('Error getting assignee tasks:', error);
      }
    });

    return tasks;
  }

  calculatePriorityScore(task, assignee) {
    const scores = {
      deadline: this.calculateDeadlineScore(task.dueDate),
      complexity: this.calculateComplexityScore(task.complexity),
      dependencies: this.calculateDependencyScore(task.dependencies),
      availability: this.calculateAvailabilityScore(assignee, task.startDate),
      skillMatch: this.calculateSkillMatchScore(task, assignee)
    };

    // Calculate weighted average
    const finalScore = 
      (scores.deadline * PRIORITY_WEIGHTS.DEADLINE) +
      (scores.complexity * PRIORITY_WEIGHTS.COMPLEXITY) +
      (scores.dependencies * PRIORITY_WEIGHTS.DEPENDENCIES) +
      (scores.availability * PRIORITY_WEIGHTS.AVAILABILITY) +
      (scores.skillMatch * PRIORITY_WEIGHTS.SKILL_MATCH);

    // Determine priority level
    let priority;
    if (finalScore >= PRIORITY_LEVELS.CRITICAL.score) {
      priority = { ...PRIORITY_LEVELS.CRITICAL, score: finalScore };
    } else if (finalScore >= PRIORITY_LEVELS.HIGH.score) {
      priority = { ...PRIORITY_LEVELS.HIGH, score: finalScore };
    } else if (finalScore >= PRIORITY_LEVELS.MEDIUM.score) {
      priority = { ...PRIORITY_LEVELS.MEDIUM, score: finalScore };
    } else {
      priority = { ...PRIORITY_LEVELS.LOW, score: finalScore };
    }

    return {
      ...priority,
      scores,
      details: this.generatePriorityExplanation(scores)
    };
  }

  generatePriorityExplanation(scores) {
    const factors = [];

    if (scores.deadline >= 85) {
      factors.push("Urgent deadline approaching");
    }
    if (scores.complexity >= 80) {
      factors.push("High task complexity");
    }
    if (scores.dependencies <= 30) {
      factors.push("Blocked by dependencies");
    }
    if (scores.availability <= 40) {
      factors.push("Assignee has high workload");
    }
    if (scores.skillMatch <= 50) {
      factors.push("Skills mismatch with assignee");
    }

    return factors;
  }

  prioritizeTasks(tasks, team) {
    const prioritizedTasks = tasks.map(task => {
      const assignee = team.members.find(member => member.email === task.assignedTo) || 
                      (team.leader.email === task.assignedTo ? team.leader : null);
      
      if (!assignee) {
        return {
          ...task,
          priority: { ...PRIORITY_LEVELS.MEDIUM, score: 50 },
          priorityDetails: ['Task not assigned']
        };
      }

      const priority = this.calculatePriorityScore(task, assignee);
      
      return {
        ...task,
        priority,
        priorityDetails: priority.details
      };
    });

    // Sort tasks by priority score (highest to lowest)
    return prioritizedTasks.sort((a, b) => b.priority.score - a.priority.score);
  }

  // Calculate skill match score between user and task
  calculateSkillMatchScore(userSkills, taskRequiredSkills) {
    if (!taskRequiredSkills || Object.keys(taskRequiredSkills).length === 0) {
      return 100; // No specific skills required
    }

    let totalScore = 0;
    let totalWeight = 0;

    Object.entries(taskRequiredSkills).forEach(([skill, requiredLevel]) => {
      const userLevel = userSkills[skill] || 0;
      totalScore += Math.min(100, (userLevel / requiredLevel) * 100);
      totalWeight += 1;
    });

    return totalWeight > 0 ? totalScore / totalWeight : 0;
  }

  // Calculate urgency score based on deadline
  calculateUrgencyScore(deadline) {
    const now = new Date();
    const dueDate = new Date(deadline);
    const daysUntilDue = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));

    if (daysUntilDue <= 0) return 100; // Overdue
    if (daysUntilDue <= 1) return 90;  // Due within 24 hours
    if (daysUntilDue <= 3) return 75;  // Due within 3 days
    if (daysUntilDue <= 7) return 60;  // Due within a week
    if (daysUntilDue <= 14) return 40; // Due within 2 weeks
    return 20; // Due beyond 2 weeks
  }

  // Calculate complexity score
  calculateComplexityScore(complexity) {
    return (complexity / 5) * 100;
  }

  // Calculate dependency score
  calculateDependencyScore(dependencies, allTasks) {
    if (!dependencies || dependencies.length === 0) return 100;

    const completedDependencies = dependencies.filter(depId => {
      const depTask = allTasks.find(t => t.id === depId);
      return depTask && depTask.status === 'completed';
    });

    return (completedDependencies.length / dependencies.length) * 100;
  }

  // Calculate availability score
  calculateAvailabilityScore(user) {
    const maxHours = user.availability.maxHoursPerWeek;
    const currentHours = user.availability.currentTasksHours;
    
    if (maxHours === 0) return 0;
    const availabilityPercentage = Math.max(0, ((maxHours - currentHours) / maxHours) * 100);
    
    return availabilityPercentage;
  }

  // Calculate overall priority score for a task
  calculateTaskPriority(task, user, allTasks) {
    const skillMatchScore = this.calculateSkillMatchScore(user.skills, task.requiredSkills);
    const urgencyScore = this.calculateUrgencyScore(task.deadline);
    const complexityScore = this.calculateComplexityScore(task.complexity);
    const dependencyScore = this.calculateDependencyScore(task.dependencies, allTasks);
    const availabilityScore = this.calculateAvailabilityScore(user);

    // Store individual factor scores
    task.priorityFactors = {
      skillMatch: skillMatchScore,
      urgency: urgencyScore,
      complexity: complexityScore,
      dependency: dependencyScore,
      availability: availabilityScore
    };

    // Calculate weighted average for final priority score
    task.priorityScore = (
      (skillMatchScore * TaskPrioritizationService.WEIGHTS.SKILL_MATCH) +
      (urgencyScore * TaskPrioritizationService.WEIGHTS.URGENCY) +
      (complexityScore * TaskPrioritizationService.WEIGHTS.COMPLEXITY) +
      (dependencyScore * TaskPrioritizationService.WEIGHTS.DEPENDENCY) +
      (availabilityScore * TaskPrioritizationService.WEIGHTS.AVAILABILITY)
    );

    return task;
  }

  // Prioritize all tasks for a specific user
  prioritizeUserTasks(tasks, user) {
    const userTasks = tasks.filter(task => task.assignedTo === user.email);
    
    // Calculate priority for each task
    const prioritizedTasks = userTasks.map(task => 
      this.calculateTaskPriority(task, user, tasks)
    );

    // Sort tasks by priority score (highest first)
    return prioritizedTasks.sort((a, b) => b.priorityScore - a.priorityScore);
  }

  // Get priority level label and color
  getPriorityLevel(score) {
    if (score >= 80) return { label: 'Critical', color: '#ef4444' };
    if (score >= 60) return { label: 'High', color: '#f97316' };
    if (score >= 40) return { label: 'Medium', color: '#eab308' };
    return { label: 'Low', color: '#22c55e' };
  }

  // Get explanation for priority score
  getPriorityExplanation(task) {
    const factors = [];
    const { priorityFactors } = task;

    if (priorityFactors.urgency >= 75) {
      factors.push('Urgent deadline approaching');
    }
    if (priorityFactors.skillMatch <= 50) {
      factors.push('Skill gap identified');
    }
    if (priorityFactors.complexity >= 80) {
      factors.push('High task complexity');
    }
    if (priorityFactors.dependency <= 50) {
      factors.push('Blocked by dependencies');
    }
    if (priorityFactors.availability <= 30) {
      factors.push('Limited availability');
    }

    return factors;
  }

  // AI-based priority calculation
  async calculateAIPriorityScore(task, context) {
    const factors = {
      deadline: this.calculateDeadlineScore(task.dueDate),
      complexity: this.calculateComplexityScore(task.complexity),
      dependencies: this.calculateDependencyScore(task.dependencies),
      teamImpact: this.calculateTeamImpact(task, context.team),
      personalImpact: this.calculatePersonalImpact(task, context.user),
      skillMatch: this.calculateSkillMatchScore(task, context.user)
    };

    // AI-based weight adjustment based on context
    const weights = this.getAIAdjustedWeights(context.viewType, factors);

    // Calculate final score using AI-adjusted weights
    const finalScore = Object.entries(factors).reduce(
      (score, [factor, value]) => score + (value * weights[factor]),
      0
    );

    return {
      score: finalScore,
      factors,
      weights,
      explanation: this.generateAIPriorityExplanation(factors, weights)
    };
  }

  calculateTeamImpact(task, team) {
    // Calculate how critical this task is for team goals
    const teamGoals = team.goals || [];
    const matchingGoals = teamGoals.filter(goal => 
      task.tags?.some(tag => goal.keywords.includes(tag))
    ).length;

    return (matchingGoals / teamGoals.length) * 100;
  }

  calculatePersonalImpact(task, user) {
    // Calculate how important this task is for user's personal goals
    const userGoals = user.personalGoals || [];
    const matchingGoals = userGoals.filter(goal => 
      task.tags?.some(tag => goal.keywords.includes(tag))
    ).length;

    return (matchingGoals / userGoals.length) * 100;
  }

  getAIAdjustedWeights(viewType, factors) {
    // Base weights
    const baseWeights = {
      deadline: 0.3,
      complexity: 0.2,
      dependencies: 0.15,
      teamImpact: 0.2,
      personalImpact: 0.1,
      skillMatch: 0.05
    };

    // Adjust weights based on view type and factors
    if (viewType === 'personal') {
      return {
        ...baseWeights,
        personalImpact: 0.3,
        teamImpact: 0.1
      };
    } else if (viewType === 'team') {
      return {
        ...baseWeights,
        teamImpact: 0.3,
        personalImpact: 0.1
      };
    }

    return baseWeights;
  }

  generateAIPriorityExplanation(factors, weights) {
    const explanations = [];

    // Add explanations based on significant factors
    if (factors.deadline * weights.deadline > 20) {
      explanations.push(`Deadline impact: ${Math.round(factors.deadline)}%`);
    }
    if (factors.teamImpact * weights.teamImpact > 15) {
      explanations.push(`Team goal alignment: ${Math.round(factors.teamImpact)}%`);
    }
    if (factors.personalImpact * weights.personalImpact > 15) {
      explanations.push(`Personal goal alignment: ${Math.round(factors.personalImpact)}%`);
    }
    if (factors.skillMatch * weights.skillMatch < 50) {
      explanations.push('Skills mismatch detected');
    }

    return explanations;
  }

  async prioritizeTasks(tasks, context) {
    const prioritizedTasks = await Promise.all(
      tasks.map(async task => {
        const aiPriority = await this.calculateAIPriorityScore(task, context);
        
        // Determine priority level based on AI score
        let priorityLevel;
        if (aiPriority.score >= 90) {
          priorityLevel = { ...PRIORITY_LEVELS.CRITICAL, score: aiPriority.score };
        } else if (aiPriority.score >= 75) {
          priorityLevel = { ...PRIORITY_LEVELS.HIGH, score: aiPriority.score };
        } else if (aiPriority.score >= 50) {
          priorityLevel = { ...PRIORITY_LEVELS.MEDIUM, score: aiPriority.score };
        } else {
          priorityLevel = { ...PRIORITY_LEVELS.LOW, score: aiPriority.score };
        }

        return {
          ...task,
          priority: priorityLevel,
          priorityDetails: aiPriority.explanation,
          aiFactors: aiPriority.factors,
          aiWeights: aiPriority.weights
        };
      })
    );

    // Sort tasks by AI-calculated priority score
    return prioritizedTasks.sort((a, b) => b.priority.score - a.priority.score);
  }
}

export default new TaskPrioritizationService(); 
import taskPrioritizationService from './taskPrioritizationService';

class AITaskPrioritization {
  // Skill match confidence levels
  static SKILL_CONFIDENCE = {
    EXPERT: 0.95,
    HIGH: 0.8,
    MEDIUM: 0.6,
    LOW: 0.4,
    NOVICE: 0.2
  };

  // Deadline urgency levels
  static DEADLINE_URGENCY = {
    CRITICAL: { threshold: 1, weight: 1.5 },    // 1 day or less
    HIGH: { threshold: 3, weight: 1.25 },       // 3 days
    MEDIUM: { threshold: 7, weight: 1.0 },      // 1 week
    LOW: { threshold: 14, weight: 0.75 },       // 2 weeks
    NORMAL: { threshold: Infinity, weight: 0.5 } // Beyond 2 weeks
  };

  // Learning curve factors for different skill levels
  static LEARNING_CURVE = {
    EXPERT: 0.2,    // 20% additional time for new concepts
    ADVANCED: 0.4,   // 40% additional time
    INTERMEDIATE: 0.6, // 60% additional time
    BEGINNER: 1.0,    // 100% additional time
    NOVICE: 1.5      // 150% additional time
  };

  calculateSkillMatchScore(userSkills, taskRequirements) {
    if (!taskRequirements || Object.keys(taskRequirements).length === 0) {
      return { score: 1, details: [] };
    }

    const matchDetails = [];
    let totalScore = 0;
    let totalWeight = 0;

    Object.entries(taskRequirements).forEach(([skill, requiredLevel]) => {
      const userLevel = userSkills[skill] || 0;
      const weight = this.getSkillWeight(skill, taskRequirements);
      const matchScore = this.calculateIndividualSkillMatch(userLevel, requiredLevel);
      
      totalScore += matchScore * weight;
      totalWeight += weight;

      matchDetails.push({
        skill,
        userLevel,
        requiredLevel,
        matchScore,
        weight,
        learningCurve: this.estimateLearningCurve(userLevel, requiredLevel)
      });
    });

    const finalScore = totalWeight > 0 ? totalScore / totalWeight : 1;
    return { score: finalScore, details: matchDetails };
  }

  getSkillWeight(skill, requirements) {
    // Calculate how critical this skill is based on its level requirement
    // relative to other skills
    const skillLevel = requirements[skill];
    const maxLevel = Math.max(...Object.values(requirements));
    return skillLevel / maxLevel;
  }

  calculateIndividualSkillMatch(userLevel, requiredLevel) {
    if (userLevel >= requiredLevel) {
      return AITaskPrioritization.SKILL_CONFIDENCE.EXPERT;
    }

    const ratio = userLevel / requiredLevel;
    if (ratio >= 0.8) return AITaskPrioritization.SKILL_CONFIDENCE.HIGH;
    if (ratio >= 0.6) return AITaskPrioritization.SKILL_CONFIDENCE.MEDIUM;
    if (ratio >= 0.4) return AITaskPrioritization.SKILL_CONFIDENCE.LOW;
    return AITaskPrioritization.SKILL_CONFIDENCE.NOVICE;
  }

  estimateLearningCurve(userLevel, requiredLevel) {
    if (userLevel >= requiredLevel) return AITaskPrioritization.LEARNING_CURVE.EXPERT;
    
    const gap = requiredLevel - userLevel;
    if (gap <= 1) return AITaskPrioritization.LEARNING_CURVE.ADVANCED;
    if (gap <= 2) return AITaskPrioritization.LEARNING_CURVE.INTERMEDIATE;
    if (gap <= 3) return AITaskPrioritization.LEARNING_CURVE.BEGINNER;
    return AITaskPrioritization.LEARNING_CURVE.NOVICE;
  }

  calculateDeadlineUrgency(deadline, taskComplexity = 1) {
    const now = new Date();
    const dueDate = new Date(deadline);
    const daysUntilDeadline = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));

    // Adjust days based on task complexity
    const adjustedDays = daysUntilDeadline / taskComplexity;

    // Find appropriate urgency level
    for (const [level, { threshold, weight }] of Object.entries(AITaskPrioritization.DEADLINE_URGENCY)) {
      if (adjustedDays <= threshold) {
        return {
          level,
          weight,
          adjustedDays,
          originalDays: daysUntilDeadline
        };
      }
    }

    return {
      level: 'NORMAL',
      weight: AITaskPrioritization.DEADLINE_URGENCY.NORMAL.weight,
      adjustedDays,
      originalDays: daysUntilDeadline
    };
  }

  async prioritizeTasks(tasks, user, context = {}) {
    const prioritizedTasks = await Promise.all(tasks.map(async task => {
      // Calculate skill match
      const skillMatch = this.calculateSkillMatchScore(user.skills, task.requiredSkills);
      
      // Calculate deadline urgency
      const deadlineUrgency = this.calculateDeadlineUrgency(task.deadline, task.complexity);
      
      // Get base priority from existing service
      const basePriority = await taskPrioritizationService.calculateAIPriorityScore(task, context);

      // Calculate AI-enhanced priority score
      const enhancedScore = this.calculateEnhancedPriorityScore(
        basePriority.score,
        skillMatch,
        deadlineUrgency,
        task
      );

      // Generate detailed explanation
      const explanation = this.generateEnhancedExplanation(
        skillMatch,
        deadlineUrgency,
        basePriority,
        task
      );

      return {
        ...task,
        priority: {
          ...basePriority,
          enhancedScore,
          skillMatch,
          deadlineUrgency,
          explanation
        }
      };
    }));

    // Sort tasks by enhanced priority score
    return prioritizedTasks.sort((a, b) => b.priority.enhancedScore - a.priority.enhancedScore);
  }

  calculateEnhancedPriorityScore(baseScore, skillMatch, deadlineUrgency, task) {
    // Base weight distribution
    const weights = {
      baseScore: 0.4,
      skillMatch: 0.3,
      deadline: 0.3
    };

    // Calculate weighted score
    const score = (
      (baseScore * weights.baseScore) +
      (skillMatch.score * 100 * weights.skillMatch) +
      (deadlineUrgency.weight * 100 * weights.deadline)
    );

    // Apply modifiers based on task properties
    const modifiers = this.calculateScoreModifiers(task);
    
    return Math.min(100, score * modifiers.total);
  }

  calculateScoreModifiers(task) {
    const modifiers = {
      dependencies: 1.0,
      complexity: 1.0,
      teamPriority: 1.0
    };

    // Adjust for dependencies
    if (task.dependencies?.length > 0) {
      const blockedDependencies = task.dependencies.filter(d => !d.completed).length;
      modifiers.dependencies = 1 + (blockedDependencies / task.dependencies.length * 0.2);
    }

    // Adjust for complexity
    if (task.complexity > 3) {
      modifiers.complexity = 1 + ((task.complexity - 3) * 0.1);
    }

    // Adjust for team priority
    if (task.teamPriority === 'high') modifiers.teamPriority = 1.2;
    if (task.teamPriority === 'critical') modifiers.teamPriority = 1.4;

    // Calculate total modifier
    modifiers.total = Object.values(modifiers).reduce((a, b) => a * b, 1);

    return modifiers;
  }

  generateEnhancedExplanation(skillMatch, deadlineUrgency, basePriority, task) {
    const explanation = [];

    // Skill match explanation
    if (skillMatch.score < 0.6) {
      explanation.push({
        type: 'warning',
        message: 'Skill gap detected',
        details: skillMatch.details
          .filter(d => d.matchScore < 0.6)
          .map(d => `${d.skill}: User level ${d.userLevel} vs Required ${d.requiredLevel}`)
      });
    }

    // Deadline explanation
    if (deadlineUrgency.level === 'CRITICAL' || deadlineUrgency.level === 'HIGH') {
      explanation.push({
        type: 'urgent',
        message: `${deadlineUrgency.level.toLowerCase()} deadline priority`,
        details: [`${deadlineUrgency.originalDays} days remaining`]
      });
    }

    // Learning curve warning
    const highLearningCurve = skillMatch.details.filter(d => d.learningCurve > AITaskPrioritization.LEARNING_CURVE.INTERMEDIATE);
    if (highLearningCurve.length > 0) {
      explanation.push({
        type: 'info',
        message: 'Significant learning curve detected',
        details: highLearningCurve.map(d => `${d.skill}: May require additional time for skill development`)
      });
    }

    // Add base priority explanations
    if (basePriority.explanation) {
      explanation.push({
        type: 'base',
        message: 'Additional factors',
        details: basePriority.explanation
      });
    }

    return explanation;
  }
}

export default new AITaskPrioritization(); 
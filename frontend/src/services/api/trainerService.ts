import { FeedbackItem, TrainerMatchResult } from '../../types';
import { MOCK_FEEDBACK, MOCK_TRAINER_MATCHES } from '../mockData';

export const trainerService = {
  async getFeedback(): Promise<FeedbackItem[]> {
    return MOCK_FEEDBACK;
  },

  async matchTrainers(subject: string, requiredCompetency: string): Promise<TrainerMatchResult[]> {
    // Simulated smart trainer matching logic
    return MOCK_TRAINER_MATCHES.map((t) => {
      let boost = 0;
      if (t.expertise.some((e) => e.toLowerCase().includes(subject.toLowerCase()))) {
        boost += 5;
      }
      if (t.expertise.some((e) => e.toLowerCase().includes(requiredCompetency.toLowerCase()))) {
        boost += 5;
      }
      return {
        ...t,
        matchScore: Math.min(99, t.matchScore + boost)
      };
    }).sort((a, b) => b.matchScore - a.matchScore);
  }
};

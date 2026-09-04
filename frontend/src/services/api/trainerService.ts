import { FeedbackItem, TrainerMatchResult } from '../../types';
import { fetchApi } from './apiClient';

export const trainerService = {
  async getFeedback(): Promise<FeedbackItem[]> {
    return fetchApi('/feedback/trainer/me');
  },

  async matchTrainers(subject: string, requiredCompetency: string, targetCourse?: string): Promise<TrainerMatchResult[]> {
    return fetchApi('/admin/trainers/match', {
      method: 'POST',
      body: JSON.stringify({ subject, requiredCompetency, targetCourse })
    });
  }
};

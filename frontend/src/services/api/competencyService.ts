import { Competency, SkillGapItem, HeatmapCell } from '../../types';
import { fetchApi } from './apiClient';

export const competencyService = {
  async getCompetencies(): Promise<Competency[]> {
    return fetchApi('/trainees/me/competencies');
  },

  async getSkillGaps(): Promise<SkillGapItem[]> {
    return fetchApi('/trainees/me/skill-gaps');
  },

  async getCompetencyHeatmap(): Promise<HeatmapCell[]> {
    return fetchApi('/admin/analytics/competency-heatmap');
  },

  // Generate personalized learning pathway using AI
  async generateLearningPathway(competencyName: string): Promise<any> {
    return fetchApi('/trainees/me/skill-gaps/pathway', {
      method: 'POST',
      body: JSON.stringify({ competencyName })
    });
  }
};

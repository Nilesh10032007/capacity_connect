import { Competency, SkillGapItem, HeatmapCell } from '../../types';
import { MOCK_COMPETENCIES, MOCK_SKILL_GAPS, MOCK_HEATMAP_DATA } from '../mockData';

export const competencyService = {
  async getCompetencies(): Promise<Competency[]> {
    return MOCK_COMPETENCIES;
  },

  async getSkillGaps(): Promise<SkillGapItem[]> {
    return MOCK_SKILL_GAPS;
  },

  async getCompetencyHeatmap(): Promise<HeatmapCell[]> {
    return MOCK_HEATMAP_DATA;
  }
};

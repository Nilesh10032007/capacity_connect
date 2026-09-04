import { fetchApi } from './apiClient';
import { Course, Competency, SkillGapItem, Certificate, Assessment, ResourceItem } from '../../types';

export interface TraineeDashboardData {
  user: {
    name: string;
    email: string;
    department: string;
    designation: string;
    readinessScore: number;
    completionPercentage: number;
  };
  readinessScore: number;
  completionPercentage: number;
  enrollments: any[];
  certificates: Certificate[];
  assessments: Assessment[];
}

export const traineeService = {
  async getDashboardSummary(): Promise<TraineeDashboardData> {
    return fetchApi('/trainees/me/dashboard');
  },

  async getMyEnrollments(): Promise<any[]> {
    return fetchApi('/trainees/me/enrollments');
  },

  async getCompetencies(): Promise<Competency[]> {
    return fetchApi('/trainees/me/competencies');
  },

  async getSkillGaps(): Promise<SkillGapItem[]> {
    return fetchApi('/trainees/me/skill-gaps');
  },

  async getResources(): Promise<ResourceItem[]> {
    return fetchApi('/resources');
  },

  async updateCompetencyLevel(competencyId: string, currentLevel: number): Promise<any> {
    return fetchApi('/trainees/me/competencies/level', {
      method: 'POST',
      body: JSON.stringify({ competencyId, currentLevel })
    });
  },

  async enrollInCourse(courseId: string): Promise<any> {
    return fetchApi(`/courses/${courseId}/enroll`, {
      method: 'POST'
    });
  },

  async generateQuiz(competencyName: string, category: string): Promise<any> {
    return fetchApi('/trainees/me/competencies/generate-quiz', {
      method: 'POST',
      body: JSON.stringify({ competencyName, category })
    });
  }
};

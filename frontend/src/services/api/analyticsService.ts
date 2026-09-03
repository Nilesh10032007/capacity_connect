import { Announcement } from '../../types';
import { MOCK_ANNOUNCEMENTS } from '../mockData';

export interface AnalyticsSummary {
  totalTrainees: number;
  totalTrainers: number;
  activeCourses: number;
  completedCourses: number;
  totalCertifications: number;
  pendingAssessments: number;
  monthlyEnrollments: { month: string; enrollments: number; completions: number }[];
  performanceByDepartment: { department: string; avgScore: number; participationRate: number }[];
}

export const analyticsService = {
  async getOverviewAnalytics(): Promise<AnalyticsSummary> {
    return {
      totalTrainees: 485,
      totalTrainers: 32,
      activeCourses: 18,
      completedCourses: 142,
      totalCertifications: 620,
      pendingAssessments: 24,
      monthlyEnrollments: [
        { month: 'Mar', enrollments: 65, completions: 42 },
        { month: 'Apr', enrollments: 82, completions: 58 },
        { month: 'May', enrollments: 110, completions: 75 },
        { month: 'Jun', enrollments: 95, completions: 80 },
        { month: 'Jul', enrollments: 130, completions: 92 },
        { month: 'Aug', enrollments: 145, completions: 105 }
      ],
      performanceByDepartment: [
        { department: 'Severe Weather & Radar', avgScore: 84, participationRate: 92 },
        { department: 'Numerical Modeling', avgScore: 79, participationRate: 88 },
        { department: 'Satellite Operations', avgScore: 88, participationRate: 95 },
        { department: 'Climate & Monsoon', avgScore: 91, participationRate: 85 },
        { department: 'IT & Infrastructure', avgScore: 82, participationRate: 90 }
      ]
    };
  },

  async getAnnouncements(): Promise<Announcement[]> {
    return MOCK_ANNOUNCEMENTS;
  },

  async createAnnouncement(announcement: Omit<Announcement, 'id' | 'date'>): Promise<Announcement> {
    const newAnc: Announcement = {
      ...announcement,
      id: `anc_${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    MOCK_ANNOUNCEMENTS.unshift(newAnc);
    return newAnc;
  }
};

import { Course, ResourceItem, Assessment, Certificate } from '../../types';
import { fetchApi } from './apiClient';

export const courseService = {
  async getCourses(): Promise<Course[]> {
    return fetchApi('/courses');
  },

  async getCourseById(id: string): Promise<Course | undefined> {
    return fetchApi(`/courses/${id}`);
  },

  async createCourse(newCourseData: Partial<Course>): Promise<Course> {
    return fetchApi('/courses', {
      method: 'POST',
      body: JSON.stringify(newCourseData)
    });
  },

  async updateCourseStatus(courseId: string, status: Course['status']): Promise<Course> {
    return fetchApi(`/courses/${courseId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  },

  async getResources(courseId?: string): Promise<ResourceItem[]> {
    if (courseId) {
      return fetchApi(`/resources/course/${courseId}`);
    }
    return fetchApi('/resources');
  },

  async uploadResource(resourceData: FormData): Promise<ResourceItem> {
    return fetchApi('/resources/upload', {
      method: 'POST',
      body: resourceData
    });
  },

  async getAssessments(): Promise<Assessment[]> {
    return fetchApi('/assessments/me/pending'); // Mapping getAssessments to pending
  },

  async submitAssessmentScore(assessmentId: string, answers: any): Promise<any> {
    return fetchApi(`/assessments/${assessmentId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers })
    });
  },

  async getCertificates(): Promise<Certificate[]> {
    return fetchApi('/certificates/me');
  }
};

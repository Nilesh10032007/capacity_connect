import { Course, ResourceItem, Assessment, Certificate } from '../../types';
import { MOCK_COURSES, MOCK_RESOURCES, MOCK_ASSESSMENTS, MOCK_CERTIFICATES } from '../mockData';

export const courseService = {
  async getCourses(): Promise<Course[]> {
    return MOCK_COURSES;
  },

  async getCourseById(id: string): Promise<Course | undefined> {
    return MOCK_COURSES.find((c) => c.id === id);
  },

  async createCourse(newCourseData: Omit<Course, 'id' | 'enrolledCount' | 'completionRate' | 'rating' | 'reviewCount'>): Promise<Course> {
    const newCourse: Course = {
      ...newCourseData,
      id: `crs_${Date.now()}`,
      enrolledCount: 0,
      completionRate: 0,
      rating: 5.0,
      reviewCount: 0,
      status: 'pending_approval'
    };
    MOCK_COURSES.unshift(newCourse);
    return newCourse;
  },

  async updateCourseStatus(courseId: string, status: Course['status']): Promise<Course> {
    const course = MOCK_COURSES.find((c) => c.id === courseId);
    if (course) {
      course.status = status;
      return course;
    }
    throw new Error('Course not found');
  },

  async getResources(courseId?: string): Promise<ResourceItem[]> {
    if (courseId) {
      return MOCK_RESOURCES.filter((r) => r.courseId === courseId);
    }
    return MOCK_RESOURCES;
  },

  async uploadResource(resource: Omit<ResourceItem, 'id' | 'uploadDate'>): Promise<ResourceItem> {
    const newResource: ResourceItem = {
      ...resource,
      id: `res_${Date.now()}`,
      uploadDate: new Date().toISOString().split('T')[0]
    };
    MOCK_RESOURCES.unshift(newResource);
    return newResource;
  },

  async getAssessments(): Promise<Assessment[]> {
    return MOCK_ASSESSMENTS;
  },

  async submitAssessmentScore(assessmentId: string, score: number): Promise<Assessment> {
    const asm = MOCK_ASSESSMENTS.find((a) => a.id === assessmentId);
    if (asm) {
      asm.status = 'completed';
      asm.completedDate = new Date().toISOString().split('T')[0];
      asm.userScore = score;
      return asm;
    }
    throw new Error('Assessment not found');
  },

  async getCertificates(): Promise<Certificate[]> {
    return MOCK_CERTIFICATES;
  }
};

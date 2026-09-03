export type UserRole = 'trainee' | 'trainer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  department: string;
  designation: string;
  qualification: string;
  experienceYears: number;
  skills: string[];
  interests: string[];
  certifications: string[];
  bio?: string;
  completionPercentage?: number;
  readinessScore?: number;
}

export type CompetencyLevel = 1 | 2 | 3 | 4 | 5; // Level 1 (Basic) to 5 (Expert)

export interface Competency {
  id: string;
  name: string;
  category: 'Atmospheric Physics' | 'Numerical Modeling' | 'Remote Sensing' | 'Data Science & AI' | 'Instrumentation' | 'Aviation & Marine';
  currentLevel: CompetencyLevel;
  requiredLevel: CompetencyLevel;
  gap: number;
  description: string;
  lastAssessedDate: string;
  trend: 'improving' | 'stable' | 'needs_attention';
}

export interface CourseModule {
  id: string;
  title: string;
  duration: string;
  contentType: 'video' | 'pdf' | 'interactive' | 'lab';
  isCompleted: boolean;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  subject: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  duration: string; // e.g. "6 Weeks (40 hrs)"
  trainerId: string;
  trainerName: string;
  trainerAvatar: string;
  competenciesCovered: string[];
  prerequisites: string[];
  thumbnail: string;
  enrolledCount: number;
  completionRate: number;
  rating: number;
  reviewCount: number;
  status: 'draft' | 'pending_approval' | 'published' | 'archived';
  progress?: number; // User specific progress (0-100)
  modules?: CourseModule[];
  resourcesCount: number;
}

export interface ResourceItem {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'presentation' | 'code' | 'dataset';
  fileSize: string;
  uploadedBy: string;
  uploadDate: string;
  downloadUrl: string;
  courseId?: string;
  category: string;
}

export interface QuizQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface Assessment {
  id: string;
  title: string;
  courseTitle: string;
  courseId: string;
  durationMinutes: number;
  totalQuestions: number;
  passingScore: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  dueDate?: string;
  completedDate?: string;
  userScore?: number;
  status: 'upcoming' | 'completed' | 'overdue' | 'available';
  retakeAllowed: boolean;
  questions?: QuizQuestion[];
}

export interface Certificate {
  id: string;
  certificateCode: string;
  courseTitle: string;
  courseId: string;
  issueDate: string;
  expiryDate?: string;
  recipientName: string;
  issuingAuthority: string;
  grade: string;
  verificationUrl: string;
}

export interface SkillGapItem {
  id: string;
  competencyName: string;
  department: string;
  currentLevel: number;
  requiredLevel: number;
  gapScore: number;
  priority: 'High' | 'Medium' | 'Low';
  affectedTraineesCount: number;
  recommendedCourses: string[];
  recommendedResources: string[];
}

export interface FeedbackItem {
  id: string;
  traineeName: string;
  traineeAvatar: string;
  courseTitle: string;
  rating: number;
  date: string;
  comment: string;
  sentiment: 'positive' | 'neutral' | 'constructive';
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  priority: 'high' | 'medium' | 'normal';
  targetRoles: UserRole[];
  category: string;
}

export interface HeatmapCell {
  department: string;
  competency: string;
  currentAvg: number;
  requiredAvg: number;
  gap: number;
  traineeCount: number;
}

export interface TrainerMatchResult {
  trainerId: string;
  trainerName: string;
  trainerAvatar: string;
  matchScore: number; // percentage 0-100
  expertise: string[];
  rating: number;
  experienceYears: number;
  coursesTaught: number;
  availability: 'Available' | 'High Load' | 'Limited';
  reasons: string[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'alert';
}

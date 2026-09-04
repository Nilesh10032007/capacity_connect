import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { Competency } from '../models/Competency';
import { Course } from '../models/Course';
import { CourseModule } from '../models/CourseModule';
import { Assessment } from '../models/Assessment';
import { AssessmentQuestion } from '../models/AssessmentQuestion';

import { UserCompetency } from '../models/UserCompetency';
import { Enrollment } from '../models/Enrollment';
import { Certificate } from '../models/Certificate';
import { ResourceItem } from '../models/ResourceItem';
import { AssessmentResult } from '../models/AssessmentResult';

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/capacityconnect');
    console.log('MongoDB Connected for Seeding');

    // Clear existing data
    await User.deleteMany();
    await Competency.deleteMany();
    await UserCompetency.deleteMany();
    await Course.deleteMany();
    await CourseModule.deleteMany();
    await Enrollment.deleteMany();
    await Assessment.deleteMany();
    await AssessmentQuestion.deleteMany();
    await Certificate.deleteMany();
    await ResourceItem.deleteMany();

    const adminHash = await bcrypt.hash('Admin@123', 10);
    const trainerHash = await bcrypt.hash('Trainer@123', 10);
    const traineeHash = await bcrypt.hash('Trainee@123', 10);

    // 1. Users
    const admin = await User.create({
      name: 'Dr. Admin', email: 'admin@capacityconnect.com', passwordHash: adminHash, role: 'admin',
      department: 'HR', designation: 'Director', skills: [], interests: [], certifications: []
    });

    const trainer1 = await User.create({
      name: 'Prof. S. K. Roy', email: 'trainer@capacityconnect.com', passwordHash: trainerHash, role: 'trainer',
      department: 'Radar Meteorology', designation: 'Senior Scientist G', skills: ['Radar Meteorology', 'Doppler Processing'], interests: [], certifications: [], experienceYears: 18
    });
    const trainer2 = await User.create({
      name: 'Dr. Ananya Sharma', email: 'trainer2@capacityconnect.com', passwordHash: trainerHash, role: 'trainer',
      department: 'Numerical Modeling', designation: 'Scientist E', skills: ['Numerical Modeling', 'AI/ML'], interests: [], certifications: [], experienceYears: 12
    });

    const trainee1 = await User.create({
      name: 'Officer Rajesh Kumar', email: 'trainee@capacityconnect.com', passwordHash: traineeHash, role: 'trainee',
      department: 'Radar Meteorology', designation: 'Meteorologist II', skills: ['Radar Meteorology', 'Satellite Operations'], interests: [], certifications: [], readinessScore: 78, completionPercentage: 85
    });

    for(let i=1; i<=4; i++) {
      await User.create({
        name: `Trainee Officer ${i}`, email: `trainee${i}@capacityconnect.com`, passwordHash: traineeHash, role: 'trainee',
        department: i%2===0?'Radar Meteorology':'Numerical Modeling', designation: 'Assistant Meteorologist', skills: [], interests: [], certifications: [], readinessScore: 60 + i*5, completionPercentage: 50 + i*8
      });
    }

    // 2. Competencies
    const compRadar = await Competency.create({
      name: 'Radar Meteorology & Doppler Interpretation',
      category: 'Remote Sensing',
      description: 'Ability to operate Doppler Weather Radars (DWR) and interpret dual-polarization products for severe weather forecasting.'
    });
    const compNWP = await Competency.create({
      name: 'Numerical Weather Prediction (NWP) Modeling',
      category: 'Numerical Modeling',
      description: 'Understanding WRF, GFS, and regional dynamical weather models for mesoscale storm tracking.'
    });
    const compSat = await Competency.create({
      name: 'INSAT-3D Satellite Data Processing',
      category: 'Remote Sensing',
      description: 'Processing multispectral satellite channels, RGB composites, and atmospheric motion vectors.'
    });
    const compAI = await Competency.create({
      name: 'AI/ML in Extreme Weather Forecasting',
      category: 'Data Science & AI',
      description: 'Applying deep learning models for short-term nowcasting and severe precipitation prediction.'
    });
    const compInst = await Competency.create({
      name: 'Automatic Weather Station (AWS) Calibration',
      category: 'Instrumentation',
      description: 'Maintenance, sensor calibration, and telemetry error handling for AWS networks.'
    });

    // 3. User Competencies for trainee1
    await UserCompetency.create({
      userId: trainee1._id, competencyId: compRadar._id, currentLevel: 3, requiredLevel: 4, lastAssessedDate: new Date('2026-08-15'), trend: 'improving'
    });
    await UserCompetency.create({
      userId: trainee1._id, competencyId: compNWP._id, currentLevel: 2, requiredLevel: 4, lastAssessedDate: new Date('2026-08-10'), trend: 'needs_attention'
    });
    await UserCompetency.create({
      userId: trainee1._id, competencyId: compSat._id, currentLevel: 4, requiredLevel: 4, lastAssessedDate: new Date('2026-08-01'), trend: 'stable'
    });
    await UserCompetency.create({
      userId: trainee1._id, competencyId: compAI._id, currentLevel: 1, requiredLevel: 3, lastAssessedDate: new Date('2026-07-20'), trend: 'needs_attention'
    });
    await UserCompetency.create({
      userId: trainee1._id, competencyId: compInst._id, currentLevel: 3, requiredLevel: 3, lastAssessedDate: new Date('2026-08-18'), trend: 'stable'
    });

    // 4. Create 3 Courses
    const course1 = await Course.create({
      code: 'MET-101',
      title: 'Advanced Doppler Weather Radar & Storm Nowcasting',
      subject: 'Radar Meteorology',
      description: 'Comprehensive guide to interpreting DWR data for severe weather.',
      difficulty: 'Advanced',
      duration: '4 Weeks',
      trainerId: trainer1._id,
      status: 'published',
      competenciesCovered: ['Radar Meteorology & Doppler Interpretation']
    });

    const course2 = await Course.create({
      code: 'NWP-201',
      title: 'Operational Numerical Weather Prediction',
      subject: 'Numerical Modeling',
      description: 'Understanding WRF model outputs and predictability.',
      difficulty: 'Intermediate',
      duration: '6 Weeks',
      trainerId: trainer2._id,
      status: 'published',
      competenciesCovered: ['Numerical Weather Prediction (NWP) Modeling']
    });

    const course3 = await Course.create({
      code: 'SAT-301',
      title: 'Satellite Meteorology Applications',
      subject: 'Remote Sensing',
      description: 'Advanced satellite image interpretation for meteorologists.',
      difficulty: 'Expert',
      duration: '8 Weeks',
      trainerId: trainer1._id,
      status: 'published',
      competenciesCovered: ['INSAT-3D Satellite Data Processing']
    });

    // 5. Enroll Trainee 1 in Course 1
    await Enrollment.create({
      traineeId: trainee1._id,
      courseId: course1._id,
      status: 'active',
      progress: 45
    });

    // 6. Create Assessments for Course 1
    const pendingAssessment = await Assessment.create({
      courseId: course1._id,
      title: 'Mid-Term Exam: Radar Signatures',
      durationMinutes: 30,
      passingScore: 75,
      difficulty: 'Medium',
      status: 'published',
      retakeAllowed: true
    });

    await AssessmentQuestion.create({
      assessmentId: pendingAssessment._id,
      questionText: 'Which radar product is best for detecting hail?',
      options: ['Reflectivity', 'Velocity', 'Correlation Coefficient', 'Specific Differential Phase'],
      correctOptionIndex: 2,
      explanation: 'CC drops significantly in regions of mixed precipitation, like hail.'
    });

    const completedAssessment = await Assessment.create({
      courseId: course1._id,
      title: 'Pre-Course Assessment',
      durationMinutes: 15,
      passingScore: 60,
      difficulty: 'Easy',
      status: 'published',
      retakeAllowed: false
    });

    await AssessmentQuestion.create({
      assessmentId: completedAssessment._id,
      questionText: 'What does DWR stand for?',
      options: ['Dual Wave Radar', 'Doppler Weather Radar', 'Dynamic Wind Resource', 'Digital Weather Receiver'],
      correctOptionIndex: 1,
      explanation: 'DWR stands for Doppler Weather Radar.'
    });

    // 7. Assessment Result & Certificate for Trainee 1
    await AssessmentResult.create({
      assessmentId: completedAssessment._id,
      traineeId: trainee1._id,
      score: 95,
      status: 'passed',
      completedDate: new Date()
    });

    await Certificate.create({
      certificateCode: `IMD-CAP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      courseId: course1._id,
      traineeId: trainee1._id,
      issuingAuthority: 'India Meteorological Department (IMD) & MoES',
      grade: 'Distinction (95%)',
      verificationUrl: 'https://capacityconnect.moes.gov.in/verify/demo-cert'
    });

    console.log('Database seeded with users, competencies, courses, enrollments, assessments, and certificates!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding DB:', error);
    process.exit(1);
  }
};

seedDB();


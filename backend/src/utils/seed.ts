import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { Competency } from '../models/Competency';
import { Course } from '../models/Course';
import { CourseModule } from '../models/CourseModule';
import { Assessment } from '../models/Assessment';
import { AssessmentQuestion } from '../models/AssessmentQuestion';

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/capacityconnect');
    console.log('MongoDB Connected for Seeding');

    // Clear existing data
    await User.deleteMany();
    await Competency.deleteMany();
    await Course.deleteMany();
    await CourseModule.deleteMany();
    await Assessment.deleteMany();
    await AssessmentQuestion.deleteMany();

    const adminHash = await bcrypt.hash('Admin@123', 10);
    const trainerHash = await bcrypt.hash('Trainer@123', 10);
    const traineeHash = await bcrypt.hash('Trainee@123', 10);

    // 1. Users
    const admin = await User.create({
      name: 'Dr. Admin', email: 'admin@capacityconnect.com', passwordHash: adminHash, role: 'admin',
      department: 'HR', designation: 'Director', skills: [], interests: [], certifications: []
    });

    const trainer1 = await User.create({
      name: 'Prof. Trainer', email: 'trainer@capacityconnect.com', passwordHash: trainerHash, role: 'trainer',
      department: 'Radar', designation: 'Senior Scientist', skills: ['Radar Meteorology'], interests: [], certifications: [], experienceYears: 10
    });
    const trainer2 = await User.create({
      name: 'Dr. Smith', email: 'trainer2@capacityconnect.com', passwordHash: trainerHash, role: 'trainer',
      department: 'NWP', designation: 'Scientist', skills: ['NWP Modeling'], interests: [], certifications: [], experienceYears: 8
    });

    const trainees = [];
    for(let i=1; i<=5; i++) {
      const trainee = await User.create({
        name: `Trainee ${i}`, email: `trainee${i}@capacityconnect.com`, passwordHash: traineeHash, role: 'trainee',
        department: i%2===0?'Radar':'NWP', designation: 'Officer', skills: [], interests: [], certifications: [], readinessScore: 60 + i*5,
      });
      trainees.push(trainee);
    }
    const trainee1 = await User.create({
      name: 'Test Trainee', email: 'trainee@capacityconnect.com', passwordHash: traineeHash, role: 'trainee',
      department: 'Observation', designation: 'Officer', skills: [], interests: [], certifications: [], readinessScore: 75,
    });
    trainees.push(trainee1);

    // 2. Competencies
    const compRadar = await Competency.create({ name: 'Radar Meteorology & Doppler Interpretation', category: 'Remote Sensing', description: 'Radar skills' });
    const compNWP = await Competency.create({ name: 'Numerical Weather Prediction (NWP) Modeling', category: 'Modeling', description: 'NWP skills' });
    const compSat = await Competency.create({ name: 'Satellite Data Assimilation', category: 'Remote Sensing', description: 'Satellite' });
    const compAI = await Competency.create({ name: 'AI/ML in Extreme Weather Forecasting', category: 'Data Science', description: 'AI ML' });

    // 3. Courses
    const course1 = await Course.create({
      code: 'MET-401', title: 'Advanced Doppler Radar', subject: 'Radar Meteorology', description: 'Radar basics', difficulty: 'Advanced',
      duration: '36 hrs', trainerId: trainer1._id, status: 'published', competenciesCovered: [compRadar.name], prerequisites: []
    });
    
    // Modules
    await CourseModule.create({ courseId: course1._id, title: 'Intro to Radar', duration: '2 hrs', contentType: 'video', orderIndex: 1 });
    await CourseModule.create({ courseId: course1._id, title: 'Doppler Lab', duration: '4 hrs', contentType: 'lab', orderIndex: 2 });

    // Assessment
    const asmt1 = await Assessment.create({
      courseId: course1._id, title: 'Radar Basics Exam', durationMinutes: 30, passingScore: 70, difficulty: 'Medium', retakeAllowed: true
    });
    await AssessmentQuestion.create({
      assessmentId: asmt1._id, questionText: 'What does ZDR measure?', options: ['Reflectivity', 'Differential Reflectivity', 'Velocity', 'Phase'], correctOptionIndex: 1, explanation: 'ZDR is diff refl'
    });

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedDB();

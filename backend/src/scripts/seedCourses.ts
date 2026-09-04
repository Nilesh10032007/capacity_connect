import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Course } from '../models/Course';
import { CourseModule } from '../models/CourseModule';
import { ResourceItem } from '../models/ResourceItem';
import { User } from '../models/User';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/capacity_connect';

const seedCourses = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected.');

    const trainer = await User.findOne({ role: 'trainer' });
    if (!trainer) {
      console.error('No trainer found in DB. Please register a trainer first.');
      process.exit(1);
    }

    console.log(`Found Trainer: ${trainer.name || trainer.email}`);

    // Clean up old seeded data for this trainer
    const existingCourses = await Course.find({ trainerId: trainer._id });
    const courseIds = existingCourses.map(c => c._id);
    
    await CourseModule.deleteMany({ courseId: { $in: courseIds } });
    await ResourceItem.deleteMany({ courseId: { $in: courseIds } });
    await Course.deleteMany({ trainerId: trainer._id });
    console.log('Cleared existing courses for this trainer.');

    const coursesData = [
      {
        code: 'IMD-RAD-401',
        title: 'Mastering Radar Meteorology & Doppler Interpretation',
        subject: 'Radar Meteorology',
        description: 'Comprehensive training on DWR operations, severe weather signature detection, and short-range storm nowcasting techniques used at operational met centers.',
        difficulty: 'Advanced',
        duration: '4 Weeks',
        trainerId: trainer._id,
        trainerName: trainer.name || trainer.email,
        thumbnailUrl: 'https://images.unsplash.com/photo-1561484930-998b6a7b22e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        status: 'published',
        competenciesCovered: ['Radar Meteorology & Doppler Interpretation', 'Radar Analysis'],
        requiredLevel: 4,
        prerequisites: ['Basic Radar Meteorology'],
        customModules: [
          'Module 1: Fundamentals of Radar Meteorology & Signal Propagation',
          'Module 2: Advanced Doppler Interpretation & Velocity Mapping',
          'Module 3: Severe Weather Signatures & Hook Echoes',
          'Module 4: Real-time Nowcasting & Operational Assessment'
        ]
      },
      {
        code: 'IMD-NWP-302',
        title: 'Operational Numerical Weather Prediction (NWP) Modeling',
        subject: 'Numerical Weather Prediction',
        description: 'Learn to compile, configure, and run the Weather Research and Forecasting (WRF) model for precise atmospheric modeling and data assimilation.',
        difficulty: 'Advanced',
        duration: '4 Weeks',
        trainerId: trainer._id,
        trainerName: trainer.name || trainer.email,
        thumbnailUrl: 'https://images.unsplash.com/photo-1558486012-817176f84c6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        status: 'published',
        competenciesCovered: ['Numerical Weather Prediction (NWP) Modeling', 'NWP'],
        requiredLevel: 4,
        prerequisites: ['Fluid Dynamics', 'Linux Basics'],
        customModules: [
          'Module 1: Introduction to NWP & WRF Environment Setup',
          'Module 2: Data Assimilation & Physics Parameterization',
          'Module 3: Regional Climate Modeling & Simulation Runs',
          'Module 4: Output Analysis, Visualization & Assessment'
        ]
      },
      {
        code: 'IMD-AI-500',
        title: 'AI/ML in Extreme Weather Forecasting',
        subject: 'Artificial Intelligence',
        description: 'Applying LSTM networks, Graph Neural Networks (GNNs), and AI models to weather data for rapid forecasting of extreme weather events.',
        difficulty: 'Expert',
        duration: '4 Weeks',
        trainerId: trainer._id,
        trainerName: trainer.name || trainer.email,
        thumbnailUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        status: 'published',
        competenciesCovered: ['AI/ML in Extreme Weather Forecasting', 'Machine Learning'],
        requiredLevel: 4,
        prerequisites: ['Python Programming', 'Advanced Mathematics'],
        customModules: [
          'Module 1: Machine Learning Foundations for Meteorology',
          'Module 2: Time-series Analysis & LSTM Networks',
          'Module 3: Physics-Informed Neural Networks for Cyclones',
          'Module 4: Real-world Implementation & Final Project'
        ]
      },
      {
        code: 'IMD-AWS-101',
        title: 'Automatic Weather Station (AWS) Calibration & Maintenance',
        subject: 'Instrumentation',
        description: 'Detailed practical training on installing, calibrating, and maintaining Automatic Weather Stations across various Indian terrains.',
        difficulty: 'Intermediate',
        duration: '4 Weeks',
        trainerId: trainer._id,
        trainerName: trainer.name || trainer.email,
        thumbnailUrl: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        status: 'published',
        competenciesCovered: ['Automatic Weather Station (AWS) Calibration', 'Instrumentation'],
        requiredLevel: 4,
        prerequisites: ['Basic Electronics'],
        customModules: [
          'Module 1: AWS Architecture & Sensor Mechanisms',
          'Module 2: Standard Calibration Protocols & Troubleshooting',
          'Module 3: Data Telemetry & Transmission Diagnostics',
          'Module 4: Field Maintenance Drill & Assessment'
        ]
      }
    ];

    for (const data of coursesData) {
      const course = new Course(data as any);
      await course.save();
      console.log(`Created course: ${course.title}`);

      // Add modules
      // Add modules
      const modules = data.customModules.map((title, index) => ({
        courseId: course._id,
        title: title,
        duration: '1h 30m',
        contentType: index === 3 ? 'interactive' : 'video',
        contentUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        content: `Detailed content for ${title}. This module builds specific skills required for the competency gap.`,
        orderIndex: index + 1
      }));
      await CourseModule.insertMany(modules);

      // Add resources
      const resource = new ResourceItem({
        courseId: course._id,
        uploaderId: trainer._id,
        title: `${course.code} Course Manual`,
        type: 'pdf',
        fileSize: '4.5 MB',
        fileUrl: '#',
        category: 'Reference',
      });
      await resource.save();
    }

    console.log('Database successfully seeded with realistic IMD courses!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedCourses();

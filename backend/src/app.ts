import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/error';

import authRoutes from './routes/authRoutes';
import courseRoutes from './routes/courseRoutes';
import enrollmentRoutes from './routes/enrollmentRoutes';
import traineeRoutes from './routes/traineeRoutes';
import assessmentRoutes from './routes/assessmentRoutes';
import certificateRoutes from './routes/certificateRoutes';
import resourceRoutes from './routes/resourceRoutes';
import feedbackRoutes from './routes/feedbackRoutes';
import trainerRoutes from './routes/trainerRoutes';
import adminRoutes from './routes/adminRoutes';
import announcementRoutes from './routes/announcementRoutes';

import userRoutes from './routes/userRoutes';

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
// Enrollments specific endpoints mapping (as course enrollments might be mixed)
app.use('/api', enrollmentRoutes); 
app.use('/api/trainees', traineeRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/trainers', trainerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/announcements', announcementRoutes);

// Error handling
app.use(errorHandler);

export default app;

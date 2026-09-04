import { Request, Response, NextFunction } from 'express';
import { Enrollment } from '../models/Enrollment';
import { Course } from '../models/Course';
import { CourseModule } from '../models/CourseModule';
import { ModuleProgress } from '../models/ModuleProgress';
import { AuthRequest } from '../middleware/auth';
import { Assessment } from '../models/Assessment';

export const enrollInCourse = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const courseId = req.params.id;
    const traineeId = req.user?.userId;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    const existingEnrollment = await Enrollment.findOne({ traineeId, courseId });
    if (existingEnrollment) {
      return res.status(400).json({ success: false, message: 'Already enrolled' });
    }

    const enrollment = new Enrollment({ traineeId, courseId });
    await enrollment.save();

    // Initialize module progress
    const modules = await CourseModule.find({ courseId });
    for (const mod of modules) {
      await ModuleProgress.create({
        enrollmentId: enrollment._id,
        moduleId: mod._id,
        isCompleted: false
      });
    }

    res.status(201).json({ success: true, data: enrollment });
  } catch (error) {
    next(error);
  }
};

export const updateModuleProgress = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id, moduleId } = req.params; // id is enrollmentId

    const progress = await ModuleProgress.findOneAndUpdate(
      { enrollmentId: id, moduleId },
      { isCompleted: true, completedAt: new Date() },
      { new: true }
    );

    if (!progress) return res.status(404).json({ success: false, message: 'Progress record not found' });

    // Update overall course progress
    const allProgress = await ModuleProgress.find({ enrollmentId: id });
    const completed = allProgress.filter(p => p.isCompleted).length;
    const progressPercentage = Math.round((completed / allProgress.length) * 100);

    const enrollment = await Enrollment.findByIdAndUpdate(
      id, 
      { 
        progressPercentage,
        completedAt: progressPercentage === 100 ? new Date() : undefined
      }, 
      { new: true }
    );

    res.json({ success: true, data: { progress, enrollment } });
  } catch (error) {
    next(error);
  }
};

export const getMyEnrollments = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const enrollments = await Enrollment.find({ traineeId: req.user?.userId })
      .populate('courseId');
    res.json({ success: true, data: enrollments });
  } catch (error) {
    next(error);
  }
};

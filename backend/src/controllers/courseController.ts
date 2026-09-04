import { Request, Response, NextFunction } from 'express';
import { Course } from '../models/Course';
import { CourseModule } from '../models/CourseModule';
import { Enrollment } from '../models/Enrollment';
import { ModuleProgress } from '../models/ModuleProgress';
import { AuthRequest } from '../middleware/auth';
import { Assessment } from '../models/Assessment';

export const getCourses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const courses = await Course.find({ status: 'published' }).populate('trainerId', 'name avatarUrl');
    res.json({ success: true, data: courses });
  } catch (error) {
    next(error);
  }
};

export const getCourseById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const course = await Course.findById(req.params.id).populate('trainerId', 'name avatarUrl');
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    
    const modules = await CourseModule.find({ courseId: course._id }).sort('orderIndex');
    res.json({ success: true, data: { ...course.toObject(), modules } });
  } catch (error) {
    next(error);
  }
};

export const getMyTrainerCourses = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const courses = await Course.find({ trainerId: req.user?.userId });
    res.json({ success: true, data: courses });
  } catch (error) {
    next(error);
  }
};

import { Competency } from '../models/Competency';

export const createCourse = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const {
      code,
      title,
      subject,
      description,
      difficulty,
      duration,
      trainerName,
      competenciesCovered,
      requiredLevel,
      prerequisites,
      thumbnailUrl
    } = req.body;

    const compsList = Array.isArray(competenciesCovered)
      ? competenciesCovered
      : competenciesCovered
      ? [competenciesCovered]
      : [subject];

    const newCourse = new Course({
      code: code || `CRS-${Math.floor(100 + Math.random() * 900)}`,
      title,
      subject,
      description,
      difficulty: difficulty || 'Intermediate',
      duration: duration || '30 hrs',
      trainerId: req.user?.userId,
      trainerName: trainerName || 'Senior IMD Instructor',
      thumbnailUrl: thumbnailUrl || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
      status: 'published',
      competenciesCovered: compsList,
      requiredLevel: Number(requiredLevel) || 4,
      prerequisites: prerequisites || []
    });

    await newCourse.save();

    // Ensure corresponding Competency exists in DB
    for (const compName of compsList) {
      const existing = await Competency.findOne({ name: compName });
      if (!existing) {
        await Competency.create({
          name: compName,
          category: subject || 'Meteorology',
          description: `Core operational competency required for ${title}`
        });
      }
    }

    res.status(201).json({ success: true, data: newCourse });
  } catch (error) {
    next(error);
  }
};

export const updateCourse = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const course = await Course.findOneAndUpdate(
      { _id: req.params.id, trainerId: req.user?.userId },
      req.body,
      { new: true }
    );
    if (!course) return res.status(404).json({ success: false, message: 'Course not found or not yours' });
    res.json({ success: true, data: course });
  } catch (error) {
    next(error);
  }
};

export const updateCourseStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    res.json({ success: true, data: course });
  } catch (error) {
    next(error);
  }
};

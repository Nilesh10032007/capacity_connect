import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { Enrollment } from '../models/Enrollment';
import { Certificate } from '../models/Certificate';
import { Assessment } from '../models/Assessment';
import { AuthRequest } from '../middleware/auth';

export const getDashboard = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user?.userId).select(
      'name email department designation readinessScore completionPercentage'
    );

    // Populate enrollments with course details and trainer info
    const enrollments = await Enrollment.find({ traineeId: req.user?.userId })
      .populate({
        path: 'courseId',
        populate: { path: 'trainerId', select: 'name avatarUrl' }
      })
      .sort({ enrolledAt: -1 });

    // Certificates
    const certificates = await Certificate.find({ traineeId: req.user?.userId })
      .populate({
        path: 'courseId',
        select: 'code title subject'
      });

    // Enrolled course IDs for pending assessments
    const enrolledCourseIds = enrollments.map((e) => e.courseId?._id).filter(Boolean);
    const assessments = await Assessment.find({
      courseId: { $in: enrolledCourseIds }
    }).populate({ path: 'courseId', select: 'code title' });

    res.json({
      success: true,
      data: {
        user,
        readinessScore: user?.readinessScore || 75,
        completionPercentage: user?.completionPercentage || 80,
        enrollments,
        certificates,
        assessments
      }
    });
  } catch (error) {
    next(error);
  }
};


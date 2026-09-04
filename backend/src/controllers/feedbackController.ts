import { Request, Response, NextFunction } from 'express';
import { Feedback } from '../models/Feedback';
import { Course } from '../models/Course';
import { AuthRequest } from '../middleware/auth';

export const submitFeedback = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { rating, comment, sentiment } = req.body;
    
    const feedback = new Feedback({
      courseId: req.params.courseId,
      traineeId: req.user?.userId,
      rating,
      comment,
      sentiment: sentiment || 'neutral'
    });

    await feedback.save();
    res.status(201).json({ success: true, data: feedback });
  } catch (error) {
    next(error);
  }
};

export const getTrainerFeedback = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Find courses taught by this trainer
    const courses = await Course.find({ trainerId: req.user?.userId }).select('_id title');
    const courseIds = courses.map(c => c._id);

    const feedbacks = await Feedback.find({ courseId: { $in: courseIds } })
      .populate('traineeId', 'name avatarUrl')
      .populate('courseId', 'title code');
    
    res.json({ success: true, data: feedbacks });
  } catch (error) {
    next(error);
  }
};

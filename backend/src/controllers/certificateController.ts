import { Request, Response, NextFunction } from 'express';
import { Certificate } from '../models/Certificate';
import { AuthRequest } from '../middleware/auth';

export const getMyCertificates = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const certificates = await Certificate.find({ traineeId: req.user?.userId }).populate('courseId', 'title code');
    res.json({ success: true, data: certificates });
  } catch (error) {
    next(error);
  }
};

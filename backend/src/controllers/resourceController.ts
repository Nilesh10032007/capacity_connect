import { Request, Response, NextFunction } from 'express';
import { ResourceItem } from '../models/ResourceItem';
import { AuthRequest } from '../middleware/auth';
import fs from 'fs';
import path from 'path';

export const uploadResource = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.file && !req.body.fileUrl && !req.body.content) {
      return res.status(400).json({ success: false, message: 'Must provide a file, a fileUrl, or content.' });
    }

    const { title, type, category, courseId, fileUrl, content, fileSize } = req.body;
    
    const resource = new ResourceItem({
      uploaderId: req.user?.userId,
      title: title || (req.file ? req.file.originalname : 'Untitled Asset'),
      type: type || 'other',
      category: category || 'General',
      courseId: courseId || undefined,
      fileSize: req.file ? (req.file.size / (1024 * 1024)).toFixed(2) + ' MB' : (fileSize || '1.0 MB'),
      fileUrl: req.file ? `/uploads/${req.file.filename}` : fileUrl,
      content: content
    });

    await resource.save();
    res.status(201).json({ success: true, data: resource });
  } catch (error) {
    next(error);
  }
};

export const getResources = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // If trainer, get their uploaded resources
    // If trainee, they might need course-specific resources, but the route could handle that.
    const query = req.user?.role === 'trainer' ? { uploaderId: req.user?.userId } : {};
    
    const resources = await ResourceItem.find(query).populate('uploaderId', 'name');
    res.json({ success: true, data: resources });
  } catch (error) {
    next(error);
  }
};

export const getCourseResources = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const resources = await ResourceItem.find({ courseId: req.params.courseId });
    res.json({ success: true, data: resources });
  } catch (error) {
    next(error);
  }
};

export const deleteResource = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const resource = await ResourceItem.findOne({ _id: req.params.id, uploaderId: req.user?.userId });
    if (!resource) return res.status(404).json({ success: false, message: 'Resource not found or unauthorized' });

    if (resource.fileUrl && resource.fileUrl.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, '../../', resource.fileUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await resource.deleteOne();
    res.json({ success: true, message: 'Resource deleted' });
  } catch (error) {
    next(error);
  }
};

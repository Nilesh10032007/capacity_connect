import { Request, Response, NextFunction } from 'express';
import { UserCompetency } from '../models/UserCompetency';
import { Course } from '../models/Course';
import { AuthRequest } from '../middleware/auth';
import { User } from '../models/User';

export const getMyCompetencies = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const competencies = await UserCompetency.find({ userId: req.user?.userId }).populate('competencyId');
    res.json({ success: true, data: competencies });
  } catch (error) {
    next(error);
  }
};

export const getMySkillGaps = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user?.userId);
    const userCompetencies = await UserCompetency.find({ userId: req.user?.userId }).populate('competencyId');
    
    const gaps = [];
    
    for (const uc of userCompetencies) {
      const gap = uc.requiredLevel - uc.currentLevel;
      if (gap > 0) {
        const comp = uc.competencyId as any; // populated
        
        // Find recommended courses
        const recommendedCourses = await Course.find({
          status: 'published',
          competenciesCovered: comp.name
        }).limit(3);
        
        gaps.push({
          id: uc._id,
          competencyName: comp.name,
          department: user?.department || 'Unknown',
          currentLevel: uc.currentLevel,
          requiredLevel: uc.requiredLevel,
          gapScore: gap,
          priority: gap >= 2 ? 'High' : 'Medium',
          affectedTraineesCount: Math.floor(Math.random() * 50) + 10, // Mocked for UI, ideally an aggregate query
          recommendedCourses: recommendedCourses.map(c => c.title),
          recommendedResources: [] // Can be populated from resources if needed
        });
      }
    }
    
    res.json({ success: true, data: gaps });
  } catch (error) {
    next(error);
  }
};

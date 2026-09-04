import { Request, Response, NextFunction } from 'express';
import { UserCompetency } from '../models/UserCompetency';
import { Course } from '../models/Course';
import { AuthRequest } from '../middleware/auth';
import { User } from '../models/User';

import { Competency } from '../models/Competency';
import { generateCompetencyQuiz } from '../services/groqService';

export const getCompetencyQuiz = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { competencyName, category } = req.body;
    const questions = await generateCompetencyQuiz(
      competencyName || 'Operational Meteorology',
      category || 'Meteorology'
    );
    res.json({ success: true, data: { questions } });
  } catch (error) {
    next(error);
  }
};

export const updateMyCompetencyLevel = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { competencyId, currentLevel } = req.body;
    const userId = req.user?.userId;

    let compDoc = await Competency.findById(competencyId);
    if (!compDoc) {
      compDoc = await Competency.findOne({ name: competencyId });
    }

    if (!compDoc) {
      return res.status(404).json({ success: false, message: 'Competency not found' });
    }

    // Find course required level for this competency if set by Admin
    const linkedCourse = await Course.findOne({
      status: 'published',
      competenciesCovered: compDoc.name
    });
    const requiredLevel = linkedCourse?.requiredLevel || 4;

    const userComp = await UserCompetency.findOneAndUpdate(
      { userId, competencyId: compDoc._id },
      {
        currentLevel: Number(currentLevel),
        requiredLevel,
        lastAssessedDate: new Date(),
        trend: Number(currentLevel) >= requiredLevel ? 'stable' : 'needs_attention'
      },
      { new: true, upsert: true }
    );

    res.json({ success: true, data: userComp });
  } catch (error) {
    next(error);
  }
};

export const getMyCompetencies = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    const allCompetencies = await Competency.find();
    const userCompetencies = await UserCompetency.find({ userId });
    const userCompMap = new Map(userCompetencies.map((uc) => [uc.competencyId.toString(), uc]));

    const publishedCourses = await Course.find({ status: 'published' });

    const formatted = [];
    for (const comp of allCompetencies) {
      // Find required level from course created by admin
      const course = publishedCourses.find((c) =>
        c.competenciesCovered.some((cc) => cc.toLowerCase() === comp.name.toLowerCase())
      );
      const requiredLevel = course?.requiredLevel || 4;

      const uc = userCompMap.get(comp._id.toString());
      const currentLevel = uc ? uc.currentLevel : 0;
      const gap = Math.max(0, requiredLevel - currentLevel);

      formatted.push({
        id: comp._id,
        competencyId: comp._id,
        name: comp.name,
        category: comp.category || 'General',
        description: comp.description || '',
        currentLevel,
        requiredLevel,
        gap,
        lastAssessedDate: uc?.lastAssessedDate
          ? new Date(uc.lastAssessedDate).toISOString().split('T')[0]
          : 'Not Assessed Yet',
        trend: uc?.trend || (gap > 0 ? 'needs_attention' : 'stable')
      });
    }

    res.json({ success: true, data: formatted });
  } catch (error) {
    next(error);
  }
};

export const getMySkillGaps = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    const user = await User.findById(userId);
    const allCompetencies = await Competency.find();
    const userCompetencies = await UserCompetency.find({ userId });
    const userCompMap = new Map(userCompetencies.map((uc) => [uc.competencyId.toString(), uc]));
    const publishedCourses = await Course.find({ status: 'published' });

    const gaps = [];

    for (const comp of allCompetencies) {
      const course = publishedCourses.find((c) =>
        c.competenciesCovered.some((cc) => cc.toLowerCase() === comp.name.toLowerCase())
      );
      const requiredLevel = course?.requiredLevel || 4;

      const uc = userCompMap.get(comp._id.toString());
      const currentLevel = uc ? uc.currentLevel : 0;
      const gap = requiredLevel - currentLevel;

      if (gap > 0) {
        // Recommend courses that cover this competency
        const matchingCourses = publishedCourses.filter((c) =>
          c.competenciesCovered.some((cc) => cc.toLowerCase() === comp.name.toLowerCase())
        );

        gaps.push({
          id: comp._id,
          competencyName: comp.name,
          department: user?.department || 'Operational Meteorology',
          currentLevel,
          requiredLevel,
          gapScore: gap,
          priority: gap >= 2 ? 'High' : 'Medium',
          affectedTraineesCount: 12,
          recommendedCourses: matchingCourses.map((c) => c.title),
          recommendedCourseObjects: matchingCourses.map((c) => ({
            id: c._id,
            code: c.code,
            title: c.title,
            subject: c.subject
          }))
        });
      }
    }

    res.json({ success: true, data: gaps });
  } catch (error) {
    next(error);
  }
};

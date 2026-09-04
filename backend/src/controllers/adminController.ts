import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { Course } from '../models/Course';
import { Enrollment } from '../models/Enrollment';
import { AssessmentResult } from '../models/AssessmentResult';
import { UserCompetency } from '../models/UserCompetency';
import { generateTrainerMatchExplanation } from '../services/groqService';

export const getDashboardKPIs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTrainees = await User.countDocuments({ role: 'trainee' });
    const totalTrainers = await User.countDocuments({ role: 'trainer' });
    const totalCourses = await Course.countDocuments();
    
    const enrollments = await Enrollment.find();
    const activeLearners = enrollments.filter(e => e.progressPercentage < 100).length;
    
    res.json({
      success: true,
      data: {
        totalUsers,
        totalTrainees,
        totalTrainers,
        totalCourses,
        activeLearners
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getCompetencyHeatmap = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userComps = await UserCompetency.find().populate('userId').populate('competencyId');
    
    // Group by department -> competency
    const heatmap: any = {};

    userComps.forEach((uc: any) => {
      const dept = uc.userId?.department || 'Unknown';
      const compName = uc.competencyId?.name || 'Unknown';
      
      if (!heatmap[dept]) heatmap[dept] = {};
      if (!heatmap[dept][compName]) {
        heatmap[dept][compName] = { currentSum: 0, requiredSum: 0, count: 0 };
      }
      
      heatmap[dept][compName].currentSum += uc.currentLevel;
      heatmap[dept][compName].requiredSum += uc.requiredLevel;
      heatmap[dept][compName].count += 1;
    });

    const result = [];
    for (const dept in heatmap) {
      for (const comp in heatmap[dept]) {
        const data = heatmap[dept][comp];
        const currentAvg = parseFloat((data.currentSum / data.count).toFixed(1));
        const requiredAvg = parseFloat((data.requiredSum / data.count).toFixed(1));
        result.push({
          department: dept,
          competency: comp,
          currentAvg,
          requiredAvg,
          gap: parseFloat(Math.max(0, requiredAvg - currentAvg).toFixed(1)),
          traineeCount: data.count
        });
      }
    }

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const matchTrainers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { subject, requiredCompetency, targetCourse } = req.body;
    
    // Find trainers
    const trainers = await User.find({ role: 'trainer' });
    
    const results = [];
    
    for (const trainer of trainers) {
      // Deterministic scoring (mock algorithm)
      let score = 50; // base score
      
      if (trainer.skills.some(s => s.toLowerCase().includes(subject.toLowerCase()))) {
        score += 20;
      }
      if (trainer.experienceYears && trainer.experienceYears > 5) {
        score += 15;
      }
      // Assuming ratings and courses taught could be fetched or are embedded
      score += 10; 

      if (score > 60) {
        const reason = await generateTrainerMatchExplanation(trainer, { subject, requiredCompetency });
        
        results.push({
          trainerId: trainer._id,
          trainerName: trainer.name,
          trainerAvatar: trainer.avatarUrl || 'https://via.placeholder.com/150',
          matchScore: score,
          expertise: trainer.skills,
          rating: 4.8, // Mocked average
          experienceYears: trainer.experienceYears,
          coursesTaught: 5,
          availability: 'Available',
          reasons: reason.split('\n').filter(r => r.trim().length > 0)
        });
      }
    }
    
    // Sort descending by matchScore
    results.sort((a, b) => b.matchScore - a.matchScore);

    res.json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};

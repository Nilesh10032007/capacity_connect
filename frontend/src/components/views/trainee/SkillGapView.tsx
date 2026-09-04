import React, { useState, useEffect } from 'react';
import { Badge } from '../../common/Badge';
import { useApp } from '../../../context/AppContext';
import { BrainCircuit, BookOpen, FileText, ArrowRight, Sparkles, CheckCircle2, Loader2 } from 'lucide-react';
import { SkillGapItem } from '../../../types';
import { traineeService } from '../../../services/api/traineeService';

export const SkillGapView: React.FC = () => {
  const { setActiveTab, showToast } = useApp();
  const [skillGaps, setSkillGaps] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [enrollingId, setEnrollingId] = useState<string | null>(null);

  const loadGaps = async () => {
    try {
      setLoading(true);
      const data = await traineeService.getSkillGaps();
      setSkillGaps(data || []);
    } catch (err) {
      console.error('Failed to load skill gaps:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGaps();
  }, []);

  const handleEnrollPathway = async (gap: any) => {
    const courseObj = gap.recommendedCourseObjects?.[0];
    if (!courseObj && (!gap.recommendedCourses || gap.recommendedCourses.length === 0)) {
      setActiveTab('courses');
      showToast('Redirecting to Course Catalog...');
      return;
    }

    try {
      const courseId = courseObj?.id || gap.recommendedCourses[0];
      setEnrollingId(gap.id);
      await traineeService.enrollInCourse(courseId);
      showToast(`Enrolled in pathway course: "${courseObj?.title || gap.recommendedCourses[0]}"!`);
      setActiveTab('my-learning');
    } catch (err: any) {
      showToast(err.message || 'Enrolled in course!');
      setActiveTab('my-learning');
    } finally {
      setEnrollingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
        <span className="ml-3 text-sm text-slate-300">Calculating Live Skill Gap Analysis...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-cyan-400" />
            <span>Skill Gap Analysis & Learning Recommendations</span>
          </h2>
          <p className="text-xs text-slate-400">Personalized gap diagnostics based on your self-assessed level vs Admin course required level.</p>
        </div>
      </div>

      {/* Gaps List */}
      {skillGaps.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/40 p-12 text-center">
          <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-400 mb-3" />
          <h3 className="text-base font-bold text-white">No Skill Deficits Identified</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            You currently meet or exceed all required competency levels for active courses. Go to the Competencies tab to assess or update your skill levels.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {skillGaps.map((gap) => (
            <div
              key={gap.id}
              className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant={gap.priority === 'High' ? 'rose' : 'amber'}>
                    Priority: {gap.priority}
                  </Badge>
                  <span className="text-xs text-slate-400">Department: {gap.department}</span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">{gap.competencyName}</h3>
                  <div className="mt-1 flex items-center gap-4 text-xs text-slate-300 font-mono">
                    <span>Current: {gap.currentLevel > 0 ? `Level ${gap.currentLevel}` : 'Not Set (L0)'}</span>
                    <span>•</span>
                    <span>Required: Level {gap.requiredLevel}</span>
                    <span>•</span>
                    <span className="text-rose-400 font-bold">Deficit Gap: -{gap.gapScore} Levels</span>
                  </div>
                </div>

                {/* Recommended Courses Badges */}
                <div>
                  <span className="block text-[11px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                    Recommended Targeted Courses
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {gap.recommendedCourses && gap.recommendedCourses.length > 0 ? (
                      gap.recommendedCourses.map((crs: string, i: number) => (
                        <span
                          key={i}
                          onClick={() => {
                            setActiveTab('courses');
                            showToast(`Filtered recommendations for ${crs}`);
                          }}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 text-xs text-cyan-300 hover:bg-cyan-500 hover:text-white cursor-pointer transition-all"
                        >
                          <BookOpen className="h-3.5 w-3.5" />
                          <span>{crs}</span>
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500 italic">No matching course created by Admin yet.</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Box */}
              <div className="flex flex-col items-start lg:items-end justify-between border-t lg:border-t-0 lg:border-l border-slate-800 pt-4 lg:pt-0 lg:pl-6 gap-3">
                <div className="text-left lg:text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Trainee Cohort Gap</span>
                  <p className="text-xs font-bold text-white">Target Level Gap: -{gap.gapScore}</p>
                </div>

                <button
                  onClick={() => handleEnrollPathway(gap)}
                  disabled={enrollingId === gap.id}
                  className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-xs font-bold text-white hover:bg-cyan-500 shadow-md shadow-cyan-500/20 transition-all"
                >
                  <span>{enrollingId === gap.id ? 'Enrolling...' : 'Enroll in Pathway'}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { MOCK_SKILL_GAPS } from '../../../services/mockData';
import { Badge } from '../../common/Badge';
import { useApp } from '../../../context/AppContext';
import { BrainCircuit, BookOpen, FileText, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export const SkillGapView: React.FC = () => {
  const { setActiveTab, showToast } = useApp();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-cyan-400" />
            <span>Skill Gap Analysis & Learning Recommendations</span>
          </h2>
          <p className="text-xs text-slate-400">Personalized gap diagnostics based on your department duties & target competency profile.</p>
        </div>
      </div>

      {/* Gaps List */}
      <div className="space-y-4">
        {MOCK_SKILL_GAPS.map((gap) => (
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
                  <span>Current: Level {gap.currentLevel}</span>
                  <span>•</span>
                  <span>Required: Level {gap.requiredLevel}</span>
                  <span>•</span>
                  <span className="text-rose-400 font-bold">Deficit Gap: {gap.gapScore} Levels</span>
                </div>
              </div>

              {/* Recommended Courses Badges */}
              <div>
                <span className="block text-[11px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                  Recommended Targeted Courses
                </span>
                <div className="flex flex-wrap gap-2">
                  {gap.recommendedCourses.map((crs, i) => (
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
                  ))}
                </div>
              </div>
            </div>

            {/* Action Box */}
            <div className="flex flex-col items-start lg:items-end justify-between border-t lg:border-t-0 lg:border-l border-slate-800 pt-4 lg:pt-0 lg:pl-6 gap-3">
              <div className="text-left lg:text-right">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Trainee Cohort Gap</span>
                <p className="text-xs font-bold text-white">{gap.affectedTraineesCount} officers share this deficit</p>
              </div>

              <button
                onClick={() => {
                  setActiveTab('courses');
                  showToast('Enrolling in recommended pathway');
                }}
                className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-xs font-bold text-white hover:bg-cyan-500 shadow-md shadow-cyan-500/20 transition-all"
              >
                <span>Enroll in Pathway</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

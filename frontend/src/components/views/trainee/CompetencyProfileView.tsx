import React from 'react';
import { MOCK_COMPETENCIES } from '../../../services/mockData';
import { Badge } from '../../common/Badge';
import { Target, TrendingUp, AlertTriangle, CheckCircle, BarChart3 } from 'lucide-react';

export const CompetencyProfileView: React.FC = () => {
  const totalCompetencies = MOCK_COMPETENCIES.length;
  const targetMetCount = MOCK_COMPETENCIES.filter((c) => c.gap <= 0).length;
  const highGapCount = MOCK_COMPETENCIES.filter((c) => c.gap >= 2).length;

  return (
    <div className="space-y-6">
      {/* Header & Stats Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Target className="h-5 w-5 text-cyan-400" />
            <span>My Competency Profile</span>
          </h2>
          <p className="text-xs text-slate-400">Institutional skill assessment & level progress according to WMO / IMD guidelines.</p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="rounded-lg bg-slate-900 border border-slate-800 px-3 py-1.5">
            <span className="text-slate-400">Assessed:</span> <span className="font-bold text-white">{totalCompetencies} Core Competencies</span>
          </div>
          <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 text-emerald-400 font-semibold">
            {targetMetCount} Targets Met
          </div>
          <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 text-amber-400 font-semibold">
            {highGapCount} Gaps Identified
          </div>
        </div>
      </div>

      {/* Competencies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {MOCK_COMPETENCIES.map((comp) => {
          const isMet = comp.gap <= 0;
          const progressPercent = Math.min(100, Math.round((comp.currentLevel / comp.requiredLevel) * 100));

          return (
            <div
              key={comp.id}
              className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <Badge variant={isMet ? 'emerald' : comp.gap >= 2 ? 'rose' : 'amber'}>
                    {comp.category}
                  </Badge>
                  <span className="text-[10px] text-slate-500 font-mono">Assessed {comp.lastAssessedDate}</span>
                </div>

                <h3 className="mt-3 text-sm font-bold text-white leading-snug">{comp.name}</h3>
                <p className="mt-1 text-xs text-slate-400 line-clamp-2">{comp.description}</p>

                {/* Level Metrics Card */}
                <div className="mt-4 grid grid-cols-3 gap-2 rounded-lg bg-slate-950/80 p-2.5 border border-slate-800 text-center">
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase font-semibold">Current</span>
                    <span className="text-sm font-extrabold text-cyan-400">Level {comp.currentLevel}</span>
                  </div>
                  <div className="border-x border-slate-800">
                    <span className="block text-[10px] text-slate-400 uppercase font-semibold">Required</span>
                    <span className="text-sm font-extrabold text-white">Level {comp.requiredLevel}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase font-semibold">Skill Gap</span>
                    <span className={`text-sm font-extrabold ${isMet ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isMet ? 'None' : `-${comp.gap}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4 pt-3 border-t border-slate-800">
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-slate-400">Target Competency Ratio</span>
                  <span className="font-semibold text-slate-200">{progressPercent}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isMet ? 'bg-emerald-400' : 'bg-gradient-to-r from-amber-500 to-rose-500'
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

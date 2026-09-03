import React from 'react';
import { BarChart3, TrendingUp, Users, Award, BookOpen } from 'lucide-react';

export const TrainingAnalyticsView: React.FC = () => {
  const months = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
  const enrollments = [65, 82, 110, 95, 130, 145];
  const completions = [42, 58, 75, 80, 92, 105];

  const maxVal = 160;

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-purple-400" />
          <span>Training Analytics & Activity Metrics</span>
        </h2>
        <p className="text-xs text-slate-400">Monthly course participation, completion rates, and assessment performance trends.</p>
      </div>

      {/* Visual Bar Chart Comparison */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Monthly Course Enrollments vs Completions (2026)</h3>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="h-3 w-3 rounded bg-cyan-500" /> Enrollments
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="h-3 w-3 rounded bg-emerald-500" /> Completions
            </span>
          </div>
        </div>

        {/* Custom SVG Bar Chart */}
        <div className="h-64 w-full flex items-end justify-between gap-4 pt-8 px-4 border-b border-slate-800">
          {months.map((m, idx) => {
            const enrH = (enrollments[idx] / maxVal) * 100;
            const cmpH = (completions[idx] / maxVal) * 100;

            return (
              <div key={m} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div className="flex items-end gap-1.5 w-full justify-center h-full">
                  <div
                    className="w-5 bg-gradient-to-t from-cyan-600 to-blue-500 rounded-t transition-all hover:opacity-80"
                    style={{ height: `${enrH}%` }}
                    title={`Enrollments: ${enrollments[idx]}`}
                  />
                  <div
                    className="w-5 bg-gradient-to-t from-emerald-600 to-teal-500 rounded-t transition-all hover:opacity-80"
                    style={{ height: `${cmpH}%` }}
                    title={`Completions: ${completions[idx]}`}
                  />
                </div>
                <span className="text-xs font-mono font-bold text-slate-400">{m}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

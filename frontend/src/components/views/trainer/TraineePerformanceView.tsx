import React, { useState, useEffect } from 'react';
import { Badge } from '../../common/Badge';
import { Users, TrendingUp, Award, Search, Loader2 } from 'lucide-react';
import { courseService } from '../../../services/api/courseService';
import { useApp } from '../../../context/AppContext';

export const TraineePerformanceView: React.FC = () => {
  const { showToast } = useApp();
  const [trainees, setTrainees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrainees = async () => {
      try {
        const data = await courseService.getTrainerTrainees();
        setTrainees(data || []);
      } catch (err: any) {
        showToast(err.message || 'Failed to fetch trainees');
      } finally {
        setLoading(false);
      }
    };
    fetchTrainees();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-emerald-400" />
            <span>Trainee Operational Performance Tracking</span>
          </h2>
          <p className="text-xs text-slate-400">Monitor course progression, assessment scores, and competency growth metrics.</p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase font-semibold text-[10px]">
              <tr>
                <th className="p-4">Trainee Name</th>
                <th className="p-4">Enrolled Course</th>
                <th className="p-4">Course Progress</th>
                <th className="p-4">Exam Score</th>
                <th className="p-4">Competency Improvement</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center">
                    <Loader2 className="h-6 w-6 animate-spin text-emerald-400 mx-auto" />
                    <p className="text-xs text-slate-400 mt-2">Loading trainee data...</p>
                  </td>
                </tr>
              ) : trainees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 text-xs">
                    No trainees found enrolled in your courses.
                  </td>
                </tr>
              ) : (
                trainees.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-bold text-white">{t.name}</td>
                    <td className="p-4 text-cyan-400 font-semibold">{t.course}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-cyan-400" style={{ width: `${t.progress}%` }} />
                        </div>
                        <span className="font-mono text-[11px]">{t.progress}%</span>
                      </div>
                    </td>
                    <td className="p-4 font-bold">{t.examScore}</td>
                    <td className="p-4 text-emerald-400 flex items-center gap-1.5">
                      <TrendingUp className="h-3 w-3" />
                      {t.improvement}
                    </td>
                    <td className="p-4">
                      <Badge variant={t.status === 'Completed' ? 'emerald' : 'cyan'}>
                        {t.status}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

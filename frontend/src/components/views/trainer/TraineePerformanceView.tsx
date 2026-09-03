import React from 'react';
import { Badge } from '../../common/Badge';
import { Users, TrendingUp, Award, Search } from 'lucide-react';

export const TraineePerformanceView: React.FC = () => {
  const trainees = [
    { id: '1', name: 'Dr. Ananya Sharma', course: 'Advanced Doppler Radar Nowcasting', progress: 75, examScore: '90%', improvement: '+2 Competency Levels', status: 'Active' },
    { id: '2', name: 'Rajesh Verma', course: 'WRF Atmospheric Modeling Environment', progress: 40, examScore: '82%', improvement: '+1 Competency Level', status: 'Active' },
    { id: '3', name: 'Priya Nair', course: 'INSAT-3DR Satellite Applications', progress: 100, examScore: '95%', improvement: '+3 Competency Levels', status: 'Completed' },
    { id: '4', name: 'Dr. Vikram Sethi', course: 'Deep Learning & Physics-Informed AI', progress: 15, examScore: '78%', improvement: '+1 Competency Level', status: 'Active' }
  ];

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
              {trainees.map((t) => (
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
                  <td className="p-4 font-mono font-bold text-emerald-400">{t.examScore}</td>
                  <td className="p-4 text-emerald-400 font-semibold flex items-center gap-1">
                    <TrendingUp className="h-3.5 w-3.5" />
                    {t.improvement}
                  </td>
                  <td className="p-4">
                    <Badge variant={t.status === 'Completed' ? 'emerald' : 'cyan'}>{t.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

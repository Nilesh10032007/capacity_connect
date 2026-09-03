import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Badge } from '../../common/Badge';
import { BookOpen, GraduationCap, Briefcase, Award, Star, Shield } from 'lucide-react';

export const TrainerProfileView: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar}
              alt={user?.name}
              className="h-20 w-20 rounded-full object-cover ring-4 ring-emerald-500/30 shadow-2xl"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">{user?.name}</h2>
                <Badge variant="emerald" icon={<BookOpen className="h-3 w-3" />}>
                  WMO MASTER TRAINER
                </Badge>
              </div>
              <p className="text-xs text-emerald-400 font-semibold mt-0.5">{user?.designation}</p>
              <p className="text-xs text-slate-400">{user?.department} • {user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-emerald-400" />
            <span>Academic Credentials & Expertise</span>
          </h3>
          <div className="space-y-2 text-xs">
            <div>
              <span className="text-slate-400 block font-semibold text-[10px] uppercase">Highest Qualification</span>
              <span className="text-slate-200">{user?.qualification}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold text-[10px] uppercase">Instruction Experience</span>
              <span className="text-slate-200">{user?.experienceYears} Years Senior Research & Teaching</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold text-[10px] uppercase">Specialist Subjects Taught</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {user?.skills.map((s, i) => (
                  <span key={i} className="rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-xs text-emerald-300">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Award className="h-4 w-4 text-amber-400" />
            <span>Certifications & International Recognition</span>
          </h3>
          <ul className="space-y-2 text-xs text-slate-300">
            {user?.certifications.map((cert, i) => (
              <li key={i} className="p-2 rounded bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span>{cert}</span>
                <Badge variant="amber">VERIFIED</Badge>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

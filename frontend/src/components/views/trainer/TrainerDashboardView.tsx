import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useApp } from '../../../context/AppContext';
import { StatCard } from '../../common/StatCard';
import { Badge } from '../../common/Badge';
import {
  BookOpen,
  Users,
  CheckCircle2,
  Award,
  Star,
  FolderPlus,
  ArrowRight,
  TrendingUp,
  PlusCircle
} from 'lucide-react';
import { MOCK_COURSES, MOCK_FEEDBACK } from '../../../services/mockData';

export const TrainerDashboardView: React.FC = () => {
  const { user } = useAuth();
  const { setActiveTab } = useApp();

  const trainerCourses = MOCK_COURSES.filter((c) => c.trainerId === user?.id || c.trainerName.includes('Murthy'));
  const totalLearners = trainerCourses.reduce((acc, curr) => acc + curr.enrolledCount, 0);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-blue-950/40 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">IMD Senior Instructor Portal</span>
            </div>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-white">
              Instructor Studio • {user?.name}
            </h2>
            <p className="mt-1 text-xs text-slate-300">
              {user?.designation} • {user?.department}
            </p>
          </div>

          <button
            onClick={() => setActiveTab('create-course')}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-500 transition-all"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Create New Course</span>
          </button>
        </div>
      </div>

      {/* Overview KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <StatCard
          title="Total Courses"
          value={trainerCourses.length}
          subtitle="2 Active, 1 Draft"
          icon={<BookOpen className="h-4 w-4" />}
          accentColor="emerald"
        />
        <StatCard
          title="Active Learners"
          value={totalLearners}
          subtitle="Across 3 modules"
          icon={<Users className="h-4 w-4" />}
          accentColor="blue"
        />
        <StatCard
          title="Completed Learners"
          value={184}
          subtitle="Certified officers"
          icon={<CheckCircle2 className="h-4 w-4" />}
          accentColor="cyan"
        />
        <StatCard
          title="Avg Exam Score"
          value="84.2%"
          subtitle="Pass threshold: 75%"
          icon={<Award className="h-4 w-4" />}
          accentColor="purple"
        />
        <StatCard
          title="Rating Score"
          value="4.9 / 5"
          subtitle="Based on 67 reviews"
          icon={<Star className="h-4 w-4" />}
          accentColor="amber"
        />
        <StatCard
          title="Uploaded Assets"
          value={36}
          subtitle="PDFs, Videos, Notebooks"
          icon={<FolderPlus className="h-4 w-4" />}
          accentColor="cyan"
        />
      </div>

      {/* Main Grid: My Courses Summary & Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-emerald-400" />
              <span>Authored Courses</span>
            </h3>
            <button
              onClick={() => setActiveTab('my-courses')}
              className="text-xs font-semibold text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>Manage All ({trainerCourses.length})</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {trainerCourses.map((crs) => (
              <div key={crs.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img src={crs.thumbnail} alt={crs.title} className="h-14 w-20 rounded-lg object-cover border border-slate-800" />
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="emerald">{crs.code}</Badge>
                      <span className="text-xs text-slate-400">{crs.subject}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white mt-1">{crs.title}</h4>
                    <p className="text-xs text-slate-400">{crs.enrolledCount} Trainees • {crs.completionRate}% Completion</p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('my-courses')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700"
                >
                  Manage
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Recent Feedback */}
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Star className="h-4 w-4 text-amber-400" />
                <span>Recent Trainee Feedback</span>
              </h3>
              <button onClick={() => setActiveTab('feedback')} className="text-xs font-semibold text-emerald-400 hover:underline">
                View All
              </button>
            </div>

            <div className="space-y-3">
              {MOCK_FEEDBACK.slice(0, 2).map((fb) => (
                <div key={fb.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{fb.traineeName}</span>
                    <span className="text-amber-400 font-bold flex items-center gap-1">
                      <Star className="h-3 w-3 fill-amber-400" />
                      {fb.rating}
                    </span>
                  </div>
                  <p className="text-slate-300 italic text-[11px] leading-relaxed">"{fb.comment}"</p>
                  <span className="text-[9px] text-slate-500 block">{fb.courseTitle}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useApp } from '../../../context/AppContext';
import { StatCard } from '../../common/StatCard';
import { Badge } from '../../common/Badge';
import { Modal } from '../../common/Modal';
import {
  BookOpen,
  Award,
  FileText,
  Target,
  ArrowRight,
  PlayCircle,
  Clock,
  Sparkles,
  TrendingUp,
  Download,
  AlertCircle,
  Video,
  FileDown
} from 'lucide-react';
import { MOCK_COURSES, MOCK_COMPETENCIES, MOCK_ASSESSMENTS, MOCK_CERTIFICATES, MOCK_RESOURCES } from '../../../services/mockData';
import { Course } from '../../../types';

export const TraineeDashboardView: React.FC = () => {
  const { user } = useAuth();
  const { setActiveTab, showToast } = useApp();

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const enrolledCourses = MOCK_COURSES.filter((c) => (c.progress ?? 0) > 0);
  const pendingAssessments = MOCK_ASSESSMENTS.filter((a) => a.status === 'upcoming' || a.status === 'available');
  const earnedCertificates = MOCK_CERTIFICATES;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-cyan-950/60 via-slate-900 to-blue-950/40 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">IMD Trainee Portal</span>
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            </div>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-white">
              Welcome back, {user?.name}!
            </h2>
            <p className="mt-1 text-xs text-slate-300 max-w-2xl">
              Department of {user?.department} • {user?.designation}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Readiness Circle Widget */}
            <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-2.5">
              <div>
                <div className="text-[10px] uppercase font-semibold text-slate-400">Readiness Score</div>
                <div className="text-xl font-bold text-cyan-400">{user?.readinessScore}%</div>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <div>
                <div className="text-[10px] uppercase font-semibold text-slate-400">Profile Complete</div>
                <div className="text-xl font-bold text-emerald-400">{user?.completionPercentage}%</div>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('my-learning')}
              className="hidden sm:flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:bg-cyan-500 transition-all"
            >
              <span>Continue Learning</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Current Readiness Score"
          value={`${user?.readinessScore || 78}/100`}
          subtitle="Target level for Grade II"
          change="+4% this month"
          changeType="positive"
          icon={<Target className="h-5 w-5" />}
          accentColor="cyan"
        />
        <StatCard
          title="Courses Enrolled"
          value={enrolledCourses.length}
          subtitle="2 active in progress"
          change="On Track"
          changeType="positive"
          icon={<BookOpen className="h-5 w-5" />}
          accentColor="blue"
        />
        <StatCard
          title="Certificates Earned"
          value={earnedCertificates.length}
          subtitle="IMD / MoES Verified"
          change="2 Verified"
          changeType="positive"
          icon={<Award className="h-5 w-5" />}
          accentColor="emerald"
        />
        <StatCard
          title="Pending Assessments"
          value={pendingAssessments.length}
          subtitle="1 Due next week"
          change="Action Required"
          changeType="negative"
          icon={<FileText className="h-5 w-5" />}
          accentColor="amber"
        />
      </div>

      {/* Main Grid: Learning Progress & Competencies Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Currently Enrolled Courses */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-cyan-400" />
              <span>In Progress Courses</span>
            </h3>
            <button
              onClick={() => setActiveTab('my-learning')}
              className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>View All ({enrolledCourses.length})</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {enrolledCourses.map((course) => (
              <div
                key={course.id}
                className="group rounded-xl border border-slate-800 bg-slate-900/60 p-4 transition-all hover:border-slate-700"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="h-16 w-24 rounded-lg object-cover border border-slate-800 flex-shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="cyan">{course.code}</Badge>
                        <span className="text-xs text-slate-400">{course.subject}</span>
                      </div>
                      <h4 className="mt-1 text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {course.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">Trainer: {course.trainerName}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 flex-shrink-0">
                    <button
                      onClick={() => {
                        setSelectedCourse(course);
                        showToast(`Launching ${course.code} learning module player`);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 px-3 py-1.5 text-xs font-bold text-cyan-400 hover:bg-cyan-500 hover:text-white transition-all"
                    >
                      <PlayCircle className="h-4 w-4" />
                      <span>Resume</span>
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3 pt-3 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-400">Course Progress</span>
                    <span className="font-semibold text-cyan-400">{course.progress}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Upcoming Live Webcasts / Sessions */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
              <Video className="h-4 w-4 text-emerald-400" />
              <span>Upcoming Live Operational Briefings</span>
            </h4>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-center justify-center h-10 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <span className="text-[10px] font-bold uppercase">SEP</span>
                    <span className="text-sm font-extrabold">03</span>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">Doppler Radar Dual-Pol Signature Analysis Practicum</h5>
                    <p className="text-[11px] text-slate-400">Prof. V. K. Murthy • 14:30 IST</p>
                  </div>
                </div>
                <button
                  onClick={() => showToast('Registered for Live Webinar')}
                  className="px-3 py-1 text-xs font-semibold rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200"
                >
                  Join Link
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Competency Summary & Quick Skill Gaps */}
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Target className="h-4 w-4 text-cyan-400" />
                <span>Top Competency Levels</span>
              </h3>
              <button
                onClick={() => setActiveTab('competencies')}
                className="text-[11px] font-semibold text-cyan-400 hover:underline"
              >
                View Profile
              </button>
            </div>

            <div className="space-y-3">
              {MOCK_COMPETENCIES.slice(0, 4).map((comp) => (
                <div key={comp.id} className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/80">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200 truncate max-w-[170px]">{comp.name}</span>
                    <Badge variant={comp.gap > 0 ? 'amber' : 'emerald'}>
                      L{comp.currentLevel} / L{comp.requiredLevel}
                    </Badge>
                  </div>

                  <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-400">
                    <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-cyan-400 rounded-full"
                        style={{ width: `${(comp.currentLevel / comp.requiredLevel) * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400">
                      {comp.gap > 0 ? `Gap: ${comp.gap}` : 'Target Met'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Assessment Prompt */}
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-amber-300">Upcoming Assessment Due</h4>
                <p className="text-[11px] text-slate-300 mt-1">
                  Doppler Radar Refectivity & Velocity Mid-Term Exam is scheduled.
                </p>
                <button
                  onClick={() => setActiveTab('assessments')}
                  className="mt-2 text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
                >
                  <span>Take Test Now</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Downloadable Manuals */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <h4 className="text-xs font-bold text-white flex items-center gap-2 mb-2">
              <FileDown className="h-4 w-4 text-cyan-400" />
              <span>Recent Operational Resources</span>
            </h4>
            <div className="space-y-2">
              {MOCK_RESOURCES.slice(0, 2).map((r) => (
                <div key={r.id} className="flex items-center justify-between p-2 rounded bg-slate-950/60 text-xs border border-slate-800">
                  <span className="truncate text-slate-300 max-w-[160px]">{r.title}</span>
                  <button
                    onClick={() => showToast(`Downloaded ${r.title}`)}
                    className="p-1 text-cyan-400 hover:text-white"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Course Player Modal */}
      {selectedCourse && (
        <Modal
          isOpen={!!selectedCourse}
          onClose={() => setSelectedCourse(null)}
          title={selectedCourse.title}
          subtitle={`Interactive Learning Module • ${selectedCourse.code}`}
          maxWidth="4xl"
        >
          <div className="space-y-4">
            {/* Video Player Placeholder */}
            <div className="relative aspect-video w-full rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden">
              <img
                src={selectedCourse.thumbnail}
                alt={selectedCourse.title}
                className="absolute inset-0 h-full w-full object-cover opacity-40 blur-sm"
              />
              <div className="relative z-10 flex flex-col items-center gap-3 text-center p-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-600/80 text-white shadow-2xl animate-pulse cursor-pointer">
                  <PlayCircle className="h-10 w-10" />
                </div>
                <h4 className="text-base font-bold text-white">Module 4: Mesocyclone & Tornado Vortex Signatures</h4>
                <p className="text-xs text-slate-300 max-w-md">
                  Interactive radar velocity spectrum stream active. Operational dataset loading...
                </p>
              </div>
            </div>

            {/* Course Syllabus & Modules */}
            <div>
              <h4 className="text-sm font-bold text-white mb-2">Module Contents</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {selectedCourse.modules?.map((m) => (
                  <div key={m.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${m.isCompleted ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                      <span className={m.isCompleted ? 'text-slate-300 line-through' : 'text-white font-medium'}>{m.title}</span>
                    </div>
                    <span className="text-slate-400 font-mono">{m.duration}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { MOCK_COURSES, MOCK_RESOURCES } from '../../../services/mockData';
import { Badge } from '../../common/Badge';
import { Modal } from '../../common/Modal';
import { useApp } from '../../../context/AppContext';
import {
  BookOpen,
  PlayCircle,
  Clock,
  FileText,
  Video,
  Download,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { Course } from '../../../types';

export const MyLearningView: React.FC = () => {
  const { showToast } = useApp();
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);

  const enrolledCourses = MOCK_COURSES.filter((c) => (c.progress ?? 0) > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-cyan-400" />
            <span>My Learning Journey</span>
          </h2>
          <p className="text-xs text-slate-400">Track active course progress, video lectures, and operational training resources.</p>
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {enrolledCourses.map((course) => (
          <div
            key={course.id}
            className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-slate-800 mb-4">
                <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                <span className="absolute top-2 left-2">
                  <Badge variant="cyan">{course.code}</Badge>
                </span>
                <span className="absolute bottom-2 right-2 text-xs font-mono font-bold text-white bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800 flex items-center gap-1">
                  <Clock className="h-3 w-3 text-cyan-400" />
                  {course.duration}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="font-semibold text-cyan-400">{course.subject}</span>
                <span>•</span>
                <span>{course.difficulty}</span>
              </div>
              <h3 className="mt-1 text-base font-bold text-white">{course.title}</h3>
              <p className="mt-1 text-xs text-slate-400 line-clamp-2">{course.description}</p>
            </div>

            {/* Progress & Continue Button */}
            <div className="mt-5 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-400 font-medium">Completion Progress</span>
                <span className="font-bold text-cyan-400">{course.progress}%</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-slate-800 overflow-hidden mb-4">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all"
                  style={{ width: `${course.progress}%` }}
                />
              </div>

              <button
                onClick={() => {
                  setActiveCourse(course);
                  showToast(`Opening interactive workspace for ${course.code}`);
                }}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-cyan-600 py-2.5 text-xs font-bold text-white hover:bg-cyan-500 shadow-md shadow-cyan-500/20 transition-all"
              >
                <PlayCircle className="h-4 w-4" />
                <span>Continue Learning</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Recently Accessed Resources */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <FileText className="h-4 w-4 text-cyan-400" />
          <span>Recently Accessed Learning Resources & Notebooks</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {MOCK_RESOURCES.map((r) => (
            <div key={r.id} className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold text-cyan-400 uppercase">{r.category}</span>
                <h4 className="text-xs font-bold text-white truncate max-w-[180px]">{r.title}</h4>
                <span className="text-[10px] text-slate-500">{r.fileSize} • {r.uploadedBy}</span>
              </div>
              <button
                onClick={() => showToast(`Downloaded ${r.title}`)}
                className="p-2 rounded bg-slate-900 hover:bg-slate-800 text-cyan-400"
              >
                <Download className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Module Modal */}
      {activeCourse && (
        <Modal
          isOpen={!!activeCourse}
          onClose={() => setActiveCourse(null)}
          title={`${activeCourse.code}: ${activeCourse.title}`}
          subtitle={`Trainer: ${activeCourse.trainerName}`}
          maxWidth="4xl"
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <h4 className="text-sm font-bold text-white mb-2">Module Syllabus & Progress</h4>
              <div className="space-y-2">
                {activeCourse.modules?.map((mod, idx) => (
                  <div key={mod.id} className="flex items-center justify-between p-3 rounded bg-slate-900 border border-slate-800 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-cyan-400 font-bold">0{idx + 1}</span>
                      <span className="text-slate-200">{mod.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={mod.isCompleted ? 'emerald' : 'amber'}>
                        {mod.isCompleted ? 'Completed' : 'Pending'}
                      </Badge>
                      <button
                        onClick={() => showToast(`Playing ${mod.title}`)}
                        className="px-2 py-1 rounded bg-cyan-600 text-white font-semibold text-[10px]"
                      >
                        Play
                      </button>
                    </div>
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

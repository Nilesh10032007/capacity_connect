import React, { useState } from 'react';
import { MOCK_COURSES } from '../../../services/mockData';
import { Badge } from '../../common/Badge';
import { Modal } from '../../common/Modal';
import { useApp } from '../../../context/AppContext';
import { Course } from '../../../types';
import {
  Compass,
  Search,
  Filter,
  Star,
  User,
  Clock,
  BookOpen,
  CheckCircle,
  PlayCircle
} from 'lucide-react';

export const CourseCatalogView: React.FC = () => {
  const { showToast } = useApp();
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  const [modalCourse, setModalCourse] = useState<Course | null>(null);

  const filteredCourses = MOCK_COURSES.filter((course) => {
    const matchesSubject = selectedSubject === 'All' || course.subject === selectedSubject;
    const matchesDiff = selectedDifficulty === 'All' || course.difficulty === selectedDifficulty;
    const matchesSearch =
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.code.toLowerCase().includes(search.toLowerCase());
    return matchesSubject && matchesDiff && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Compass className="h-5 w-5 text-cyan-400" />
            <span>Operational Capacity Course Catalog</span>
          </h2>
          <p className="text-xs text-slate-400">Certified courses designed by IMD & MoES senior scientists for operational capacity enhancement.</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by course code, title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-950 py-2 pl-9 pr-4 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="rounded-lg border border-slate-800 bg-slate-950 py-2 px-3 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
          >
            <option value="All">All Subjects</option>
            <option value="Radar Meteorology">Radar Meteorology</option>
            <option value="Numerical Modeling">Numerical Modeling</option>
            <option value="Remote Sensing">Remote Sensing</option>
            <option value="Data Science & AI">Data Science & AI</option>
            <option value="Instrumentation">Instrumentation</option>
          </select>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="rounded-lg border border-slate-800 bg-slate-950 py-2 px-3 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
          >
            <option value="All">All Difficulties</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Expert">Expert</option>
          </select>
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg flex flex-col justify-between transition-all hover:border-slate-700"
          >
            <div>
              <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-slate-800 mb-4">
                <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover" />
                <span className="absolute top-2 left-2">
                  <Badge variant="cyan">{course.code}</Badge>
                </span>
                <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded bg-slate-950/80 px-2 py-0.5 text-xs text-amber-400 font-bold border border-slate-800">
                  <Star className="h-3 w-3 fill-amber-400" />
                  <span>{course.rating}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="font-semibold text-cyan-400">{course.subject}</span>
                <span className="font-mono text-slate-400">{course.duration}</span>
              </div>

              <h3 className="text-base font-bold text-white line-clamp-1">{course.title}</h3>
              <p className="mt-1 text-xs text-slate-400 line-clamp-2">{course.description}</p>

              {/* Trainer Info */}
              <div className="mt-3 flex items-center gap-2 text-xs text-slate-300">
                <img src={course.trainerAvatar} alt={course.trainerName} className="h-5 w-5 rounded-full object-cover" />
                <span className="truncate">{course.trainerName}</span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
              <span className="text-xs text-slate-400">
                {course.enrolledCount} Trainees Enrolled
              </span>

              <button
                onClick={() => setModalCourse(course)}
                className="rounded-lg bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs font-bold text-slate-200 transition-all border border-slate-700"
              >
                View Course
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Course Detail Modal */}
      {modalCourse && (
        <Modal
          isOpen={!!modalCourse}
          onClose={() => setModalCourse(null)}
          title={`${modalCourse.code}: ${modalCourse.title}`}
          subtitle={`Subject: ${modalCourse.subject} • Trainer: ${modalCourse.trainerName}`}
          maxWidth="2xl"
        >
          <div className="space-y-4">
            <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-slate-800">
              <img src={modalCourse.thumbnail} alt={modalCourse.title} className="h-full w-full object-cover" />
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{modalCourse.description}</p>

            {/* Prerequisites & Competencies */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="font-bold text-white block mb-1">Prerequisites</span>
                <ul className="list-disc list-inside text-slate-400 space-y-0.5">
                  {modalCourse.prerequisites.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="font-bold text-white block mb-1">Competencies Addressed</span>
                <ul className="list-disc list-inside text-cyan-400 space-y-0.5">
                  {modalCourse.competenciesCovered.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setModalCourse(null)}
                className="px-4 py-2 text-xs rounded-lg text-slate-400 hover:bg-slate-800"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setModalCourse(null);
                  showToast(`Successfully enrolled in ${modalCourse.code}!`);
                }}
                className="px-4 py-2 text-xs font-bold rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white"
              >
                Enroll Now
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

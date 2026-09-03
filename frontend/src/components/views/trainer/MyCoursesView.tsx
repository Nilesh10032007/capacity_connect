import React, { useState } from 'react';
import { MOCK_COURSES } from '../../../services/mockData';
import { Badge } from '../../common/Badge';
import { Modal } from '../../common/Modal';
import { useApp } from '../../../context/AppContext';
import { Course } from '../../../types';
import { BookOpen, Users, Star, Edit, Eye, CheckCircle, Clock } from 'lucide-react';

export const MyCoursesView: React.FC = () => {
  const { showToast } = useApp();
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const togglePublish = (id: string) => {
    setCourses((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: c.status === 'published' ? 'draft' : 'published' } : c
      )
    );
    showToast('Course publication status toggled');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-emerald-400" />
            <span>Authored Courses & Curricula</span>
          </h2>
          <p className="text-xs text-slate-400">Manage operational course content, published status, and learner performance.</p>
        </div>
      </div>

      {/* Course List Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase font-semibold text-[10px]">
              <tr>
                <th className="p-4">Course Info</th>
                <th className="p-4">Subject</th>
                <th className="p-4">Trainees</th>
                <th className="p-4">Completion</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {courses.map((crs) => (
                <tr key={crs.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={crs.thumbnail} alt={crs.title} className="h-10 w-16 rounded object-cover border border-slate-800" />
                      <div>
                        <span className="font-mono font-bold text-cyan-400 text-[10px] block">{crs.code}</span>
                        <span className="font-bold text-white text-xs">{crs.title}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">{crs.subject}</td>
                  <td className="p-4 font-mono font-semibold text-white">{crs.enrolledCount} Officers</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-400" style={{ width: `${crs.completionRate}%` }} />
                      </div>
                      <span className="font-mono text-[11px]">{crs.completionRate}%</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-amber-400 flex items-center gap-1">
                      <Star className="h-3 w-3 fill-amber-400" />
                      {crs.rating}
                    </span>
                  </td>
                  <td className="p-4">
                    <Badge variant={crs.status === 'published' ? 'emerald' : 'amber'}>
                      {crs.status.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => togglePublish(crs.id)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-semibold text-slate-200"
                    >
                      {crs.status === 'published' ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      onClick={() => setEditingCourse(crs)}
                      className="px-2.5 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-[10px] font-bold text-white"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Course Modal */}
      {editingCourse && (
        <Modal
          isOpen={!!editingCourse}
          onClose={() => setEditingCourse(null)}
          title={`Edit Course: ${editingCourse.code}`}
          subtitle={editingCourse.title}
        >
          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Course Title</label>
              <input
                type="text"
                defaultValue={editingCourse.title}
                className="w-full rounded border border-slate-800 bg-slate-950 p-2 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Description</label>
              <textarea
                rows={3}
                defaultValue={editingCourse.description}
                className="w-full rounded border border-slate-800 bg-slate-950 p-2 text-white"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setEditingCourse(null)} className="px-3 py-1.5 rounded bg-slate-800 text-slate-300">
                Cancel
              </button>
              <button
                onClick={() => {
                  setEditingCourse(null);
                  showToast('Course details updated successfully');
                }}
                className="px-3 py-1.5 rounded bg-emerald-600 text-white font-bold"
              >
                Save Course
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

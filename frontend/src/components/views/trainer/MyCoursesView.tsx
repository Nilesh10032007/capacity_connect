import React, { useState, useEffect } from 'react';
import { Badge } from '../../common/Badge';
import { useApp } from '../../../context/AppContext';
import { BookOpen, Loader2 } from 'lucide-react';
import { courseService } from '../../../services/api/courseService';
import { CourseEditorView } from './CourseEditorView';

export const MyCoursesView: React.FC = () => {
  const { showToast } = useApp();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCourse, setEditingCourse] = useState<any | null>(null);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const res = await courseService.getMyTrainerCourses();
      setCourses(res || []);
    } catch (err) {
      console.error('Failed to load courses', err);
      showToast('Failed to load authored courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const togglePublish = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    try {
      await courseService.updateCourseStatus(id, newStatus);
      setCourses(prev =>
        prev.map(c =>
          (c._id === id || c.id === id) ? { ...c, status: newStatus } : c
        )
      );
      showToast(`Course ${newStatus === 'published' ? 'published' : 'unpublished'}`);
    } catch (err) {
      showToast('Failed to update course status');
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
        <span className="ml-3 text-sm text-slate-300">Loading Courses...</span>
      </div>
    );
  }

  // If we are editing, show the CourseEditorView instead of the list
  if (editingCourse) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <CourseEditorView 
          initialData={editingCourse} 
          onClose={() => {
            setEditingCourse(null);
            loadCourses(); // Refresh list after edit
          }} 
        />
      </div>
    );
  }

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
      {courses.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/40 p-12 text-center">
          <BookOpen className="mx-auto h-10 w-10 text-slate-500 mb-3" />
          <h3 className="text-base font-bold text-white">No Courses Created</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            You haven't authored any courses yet. Go to Dashboard and click "Create New Course".
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="p-4">Course Info</th>
                  <th className="p-4">Subject</th>
                  <th className="p-4">Difficulty</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {courses.map((crs) => (
                  <tr key={crs._id || crs.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={crs.thumbnailUrl || crs.thumbnail || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80'} alt={crs.title} className="h-10 w-16 rounded object-cover border border-slate-800" />
                        <div>
                          <span className="font-mono font-bold text-cyan-400 text-[10px] block">{crs.code}</span>
                          <span className="font-bold text-white text-xs">{crs.title}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">{crs.subject}</td>
                    <td className="p-4">{crs.difficulty}</td>
                    <td className="p-4 font-mono">{crs.duration}</td>
                    <td className="p-4">
                      <Badge variant={crs.status === 'published' ? 'emerald' : 'amber'}>
                        {crs.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => togglePublish(crs._id || crs.id, crs.status)}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-[10px] font-semibold text-slate-700 border border-slate-300 transition-colors"
                      >
                        {crs.status === 'published' ? 'Unpublish' : 'Publish'}
                      </button>
                      <button
                        onClick={() => setEditingCourse(crs)}
                        className="px-2.5 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-[10px] font-bold text-white transition-colors"
                      >
                        Edit Full Course
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

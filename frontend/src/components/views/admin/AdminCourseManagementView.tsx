import React, { useState } from 'react';
import { MOCK_COURSES } from '../../../services/mockData';
import { Badge } from '../../common/Badge';
import { useApp } from '../../../context/AppContext';
import { Course } from '../../../types';
import { BookOpen, CheckCircle, XCircle, Edit, Star, Search, ShieldCheck } from 'lucide-react';

export const AdminCourseManagementView: React.FC = () => {
  const { showToast } = useApp();
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);

  const approveCourse = (id: string) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'published' as const } : c))
    );
    showToast('Course approved & published to institutional catalog');
  };

  const togglePublish = (id: string) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: c.status === 'published' ? 'draft' : 'published' } : c))
    );
    showToast('Course publish state toggled');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-purple-400" />
            <span>Institutional Course Governance & Approval Hub</span>
          </h2>
          <p className="text-xs text-slate-400">Review, audit, approve, and configure national meteorology courses.</p>
        </div>
      </div>

      {/* Course Governance Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase font-semibold text-[10px]">
              <tr>
                <th className="p-4">Course Info</th>
                <th className="p-4">Author Trainer</th>
                <th className="p-4">Subject Area</th>
                <th className="p-4">Enrolled</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Approval Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {courses.map((crs) => (
                <tr key={crs.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4">
                    <div>
                      <span className="font-mono font-bold text-cyan-400 text-[10px] block">{crs.code}</span>
                      <span className="font-bold text-white text-xs">{crs.title}</span>
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-slate-200">{crs.trainerName}</td>
                  <td className="p-4">{crs.subject}</td>
                  <td className="p-4 font-mono font-bold text-white">{crs.enrolledCount} Officers</td>
                  <td className="p-4">
                    <Badge variant={crs.status === 'published' ? 'emerald' : crs.status === 'pending_approval' ? 'amber' : 'slate'}>
                      {crs.status.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    {crs.status === 'pending_approval' ? (
                      <button
                        onClick={() => approveCourse(crs.id)}
                        className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-sm"
                      >
                        Approve & Publish
                      </button>
                    ) : (
                      <button
                        onClick={() => togglePublish(crs.id)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700"
                      >
                        {crs.status === 'published' ? 'Unpublish' : 'Publish'}
                      </button>
                    )}
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

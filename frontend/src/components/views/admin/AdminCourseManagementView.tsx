import React, { useState, useEffect } from 'react';
import { Badge } from '../../common/Badge';
import { Modal } from '../../common/Modal';
import { useApp } from '../../../context/AppContext';
import { Course } from '../../../types';
import { BookOpen, Plus, Loader2 } from 'lucide-react';
import { courseService } from '../../../services/api/courseService';
import { fetchApi } from '../../../services/api/apiClient';

export const AdminCourseManagementView: React.FC = () => {
  const { showToast } = useApp();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // New Course Form State
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Radar Meteorology');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'>('Intermediate');
  const [duration, setDuration] = useState('30 hrs');
  const [trainerName, setTrainerName] = useState('Prof. S. K. Roy');
  const [competencyName, setCompetencyName] = useState('Radar Meteorology & Doppler Interpretation');
  const [requiredLevel, setRequiredLevel] = useState<number>(4);
  const [creating, setCreating] = useState<boolean>(false);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await courseService.getCourses();
      setCourses(data || []);
    } catch (err) {
      console.error('Failed to load admin courses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !code) {
      showToast('Course code and title are required');
      return;
    }

    try {
      setCreating(true);
      await fetchApi('/courses', {
        method: 'POST',
        body: JSON.stringify({
          code,
          title,
          subject,
          description: description || `Certified operational training module in ${subject}.`,
          difficulty,
          duration,
          trainerName,
          competenciesCovered: [competencyName || subject],
          requiredLevel
        })
      });

      showToast(`Course "${title}" created and published!`);
      setIsModalOpen(false);
      // Reset Form
      setCode('');
      setTitle('');
      setDescription('');
      loadCourses();
    } catch (err: any) {
      showToast(err.message || 'Error creating course');
    } finally {
      setCreating(false);
    }
  };

  const togglePublish = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'published' ? 'draft' : 'published';
      await courseService.updateCourseStatus(id, newStatus as any);
      showToast(`Course status updated to ${newStatus}`);
      loadCourses();
    } catch (err: any) {
      showToast(err.message || 'Failed to update status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-purple-400" />
            <span>Institutional Course Governance & Creation Hub</span>
          </h2>
          <p className="text-xs text-slate-400">Create, configure, and publish national meteorology courses for trainees.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:bg-cyan-500 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Create New Course</span>
        </button>
      </div>

      {/* Course Governance Table */}
      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
          <span className="ml-3 text-xs text-slate-400">Loading MongoDB Courses...</span>
        </div>
      ) : courses.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/40 p-8 text-center">
          <BookOpen className="mx-auto h-8 w-8 text-slate-500 mb-2" />
          <h3 className="text-sm font-bold text-white">No Courses Created Yet</h3>
          <p className="text-xs text-slate-400 mt-1">Click "Create New Course" above to add the first operational course.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="p-4">Course Info</th>
                  <th className="p-4">Author Trainer</th>
                  <th className="p-4">Subject Area</th>
                  <th className="p-4">Competency Covered</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
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
                    <td className="p-4">
                      <span className="text-cyan-300 font-medium">
                        {crs.competenciesCovered?.join(', ') || crs.subject}
                      </span>
                    </td>
                    <td className="p-4">
                      <Badge variant={crs.status === 'published' ? 'emerald' : 'slate'}>
                        {(crs.status || 'published').toUpperCase()}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => togglePublish(crs.id, crs.status)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700"
                      >
                        {crs.status === 'published' ? 'Unpublish' : 'Publish'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Form for Creating Course */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Operational Course"
        subtitle="Configure course parameters, covered competency, and target required level"
        maxWidth="2xl"
      >
        <form onSubmit={handleCreateCourse} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Course Code</label>
              <input
                type="text"
                placeholder="e.g. MET-501"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Course Title</label>
              <input
                type="text"
                placeholder="e.g. Advanced Doppler Weather Radar Operations"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Subject Area</label>
              <select
                value={subject}
                onChange={(e) => {
                  setSubject(e.target.value);
                  if (!competencyName) setCompetencyName(`${e.target.value} Proficiency`);
                }}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="Radar Meteorology">Radar Meteorology</option>
                <option value="Numerical Modeling">Numerical Modeling</option>
                <option value="Remote Sensing">Remote Sensing</option>
                <option value="Data Science & AI">Data Science & AI</option>
                <option value="Instrumentation">Instrumentation</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Instructor / Trainer Name</label>
              <input
                type="text"
                placeholder="e.g. Prof. S. K. Roy"
                value={trainerName}
                onChange={(e) => setTrainerName(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Covered Competency Name</label>
              <input
                type="text"
                placeholder="e.g. Radar Meteorology & Doppler Interpretation"
                value={competencyName}
                onChange={(e) => setCompetencyName(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Required Competency Target Level</label>
              <select
                value={requiredLevel}
                onChange={(e) => setRequiredLevel(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value={1}>Level 1 - Basic Knowledge</option>
                <option value={2}>Level 2 - Working Knowledge</option>
                <option value={3}>Level 3 - Operational Competent</option>
                <option value={4}>Level 4 - Advanced Expert</option>
                <option value={5}>Level 5 - Master Specialist</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Duration</label>
              <input
                type="text"
                placeholder="e.g. 36 hrs"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Course Description</label>
            <textarea
              rows={3}
              placeholder="Operational goals, modules, and target outcomes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-md shadow-cyan-500/20"
            >
              {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              <span>Save & Publish Course</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};


import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { useAuth } from '../../../context/AuthContext';
import { courseService } from '../../../services/api/courseService';
import { PlusCircle, BookOpen, Target, FileText, CheckCircle2, Sparkles } from 'lucide-react';

export const CreateCourseView: React.FC = () => {
  const { user } = useAuth();
  const { setActiveTab, showToast } = useApp();

  const [step, setStep] = useState<number>(1);
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('MET-');
  const [subject, setSubject] = useState('Radar Meteorology');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'>('Advanced');
  const [duration, setDuration] = useState('6 Weeks (36 hrs)');
  const [description, setDescription] = useState('');
  const [competencies, setCompetencies] = useState('Radar Meteorology & Doppler Interpretation');
  const [prerequisites, setPrerequisites] = useState('Atmospheric Dynamics 101');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await courseService.createCourse({
      code,
      title: title || 'New Operational Meteorology Module',
      subject,
      description: description || 'Operational training course designed for atmospheric officers.',
      difficulty,
      duration,
      trainerId: user?.id || 'usr_tn_201',
      trainerName: user?.name || 'Prof. V. K. Murthy',
      trainerAvatar: user?.avatar || '',
      competenciesCovered: competencies.split(',').map((c) => c.trim()),
      prerequisites: prerequisites.split(',').map((p) => p.trim()),
      thumbnail: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=600&auto=format&fit=crop&q=80',
      status: 'pending_approval',
      resourcesCount: 4
    });

    showToast(`Course "${code}" created and submitted for Admin approval!`);
    setActiveTab('my-courses');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <PlusCircle className="h-5 w-5 text-emerald-400" />
          <span>Create New Capacity Building Course</span>
        </h2>
        <p className="text-xs text-slate-400">Author certified training modules aligned with MoES competency guidelines.</p>
      </div>

      {/* Multi-Step Wizard Indicator */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
        <div className={`p-2.5 rounded-lg border ${step === 1 ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-slate-800 bg-slate-900 text-slate-400'}`}>
          1. Basic Details
        </div>
        <div className={`p-2.5 rounded-lg border ${step === 2 ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-slate-800 bg-slate-900 text-slate-400'}`}>
          2. Competencies & Prerequisites
        </div>
        <div className={`p-2.5 rounded-lg border ${step === 3 ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-slate-800 bg-slate-900 text-slate-400'}`}>
          3. Resources & Review
        </div>
      </div>

      <form onSubmit={handleSubmit} className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-5">
        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Course Code</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  placeholder="MET-401"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Subject Area</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Radar Meteorology">Radar Meteorology</option>
                  <option value="Numerical Modeling">Numerical Modeling</option>
                  <option value="Remote Sensing">Remote Sensing</option>
                  <option value="Data Science & AI">Data Science & AI</option>
                  <option value="Instrumentation">Instrumentation</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Course Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                placeholder="e.g. Advanced Doppler Weather Radar & Storm Nowcasting"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Duration & Load</label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  placeholder="e.g. 6 Weeks (36 hrs)"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Detailed Description</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                placeholder="Overview of operational objectives..."
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Competencies Covered (comma separated)</label>
              <input
                type="text"
                value={competencies}
                onChange={(e) => setCompetencies(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Prerequisites (comma separated)</label>
              <input
                type="text"
                value={prerequisites}
                onChange={(e) => setPrerequisites(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 py-4 text-center">
            <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto" />
            <h4 className="text-base font-bold text-white">Ready for Course Submission</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Your course configuration is complete. Submitting will register the course in draft/pending approval mode.
            </p>
          </div>
        )}

        {/* Wizard Footer Controls */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-800">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((prev) => prev - 1)}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
            >
              Back
            </button>
          ) : <div />}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep((prev) => prev + 1)}
              className="px-5 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white"
            >
              Next Step
            </button>
          ) : (
            <button
              type="submit"
              className="px-6 py-2 text-xs font-bold rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/20"
            >
              Publish Course
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

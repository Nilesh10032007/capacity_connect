import React, { useState } from 'react';
import { MOCK_ASSESSMENTS } from '../../../services/mockData';
import { useApp } from '../../../context/AppContext';
import { Badge } from '../../common/Badge';
import { Modal } from '../../common/Modal';
import { FileText, PlusCircle, HelpCircle, Clock, Award, CheckCircle } from 'lucide-react';

export const TrainerAssessmentsView: React.FC = () => {
  const { showToast } = useApp();
  const [assessments, setAssessments] = useState(MOCK_ASSESSMENTS);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState(45);
  const [numQuestions, setNumQuestions] = useState(15);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Hard');

  const handleCreateQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    const newQuiz = {
      id: `asm_${Date.now()}`,
      title: title || 'Severe Weather Doppler Reflectivity Diagnostic Test',
      courseTitle: 'Advanced Doppler Weather Radar & Storm Nowcasting',
      courseId: 'crs_101',
      durationMinutes: duration,
      totalQuestions: numQuestions,
      passingScore: 75,
      difficulty,
      dueDate: '2026-09-20',
      status: 'upcoming' as const,
      retakeAllowed: true
    };
    setAssessments((prev) => [newQuiz, ...prev]);
    setShowCreateModal(false);
    showToast(`Created MCQ Assessment "${newQuiz.title}"`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-emerald-400" />
            <span>Assessment Authoring & Question Bank</span>
          </h2>
          <p className="text-xs text-slate-400">Build MCQ tests, configure timers, and audit trainee test scores.</p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-500 transition-all"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Create MCQ Quiz</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {assessments.map((asm) => (
          <div key={asm.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2">
                <Badge variant="cyan">{asm.difficulty}</Badge>
                <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-slate-500" />
                  {asm.durationMinutes} mins
                </span>
              </div>

              <h3 className="mt-3 text-base font-bold text-white leading-snug">{asm.title}</h3>
              <p className="text-xs text-emerald-400 mt-1">{asm.courseTitle}</p>

              <div className="mt-4 grid grid-cols-2 gap-2 text-xs bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Question Pool</span>
                  <span className="font-bold text-white">{asm.totalQuestions} Questions</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Pass Benchmark</span>
                  <span className="font-bold text-emerald-400">{asm.passingScore}%</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => showToast(`Opening Question Bank Editor for ${asm.title}`)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700"
              >
                Edit Question Bank
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Assessment Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New MCQ Assessment"
        subtitle="Specify questions count, difficulty rating, and duration timer."
      >
        <form onSubmit={handleCreateQuiz} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Assessment Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded border border-slate-800 bg-slate-950 p-2.5 text-white"
              placeholder="e.g. Doppler Velocity & Radial Shear Diagnostic Test"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Questions Count</label>
              <input
                type="number"
                value={numQuestions}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
                className="w-full rounded border border-slate-800 bg-slate-950 p-2.5 text-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Time Limit (mins)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full rounded border border-slate-800 bg-slate-950 p-2.5 text-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full rounded border border-slate-800 bg-slate-950 p-2.5 text-white"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setShowCreateModal(false)} className="px-3 py-1.5 rounded bg-slate-800 text-slate-400">
              Cancel
            </button>
            <button type="submit" className="px-4 py-1.5 rounded bg-emerald-600 font-bold text-white">
              Create Assessment
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

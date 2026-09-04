import React, { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { useAuth } from '../../../context/AuthContext';
import { Badge } from '../../common/Badge';
import { Modal } from '../../common/Modal';
import { courseService } from '../../../services/api/courseService';
import {
  FileText, PlusCircle, HelpCircle, Clock, Award, CheckCircle,
  Loader2, Sparkles, Trash2, Edit3, Save, X, ChevronDown
} from 'lucide-react';

interface QuestionDraft {
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export const TrainerAssessmentsView: React.FC = () => {
  const { showToast } = useApp();
  const { user } = useAuth();

  // Assessment list
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Trainer's courses for dropdown
  const [trainerCourses, setTrainerCourses] = useState<any[]>([]);

  // Create assessment modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [duration, setDuration] = useState(45);
  const [passingScore, setPassingScore] = useState(75);
  const [numQuestions, setNumQuestions] = useState(6);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [dueDate, setDueDate] = useState('');
  const [retakeAllowed, setRetakeAllowed] = useState(true);
  const [creating, setCreating] = useState(false);

  // Question drafts for the create form
  const [questionDrafts, setQuestionDrafts] = useState<QuestionDraft[]>([]);
  const [aiGenerating, setAiGenerating] = useState(false);

  // Question Bank Editor modal
  const [editingAssessment, setEditingAssessment] = useState<any | null>(null);
  const [editQuestions, setEditQuestions] = useState<any[]>([]);
  const [loadingEditQuestions, setLoadingEditQuestions] = useState(false);
  const [savingQuestion, setSavingQuestion] = useState<string | null>(null);

  // Load assessments and courses
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [asmData, coursesData] = await Promise.all([
        courseService.getTrainerAssessments(),
        courseService.getCourses()
      ]);
      setAssessments(asmData || []);
      // Filter to only courses by this trainer
      const myCourses = (coursesData || []).filter(
        (c: any) => c.trainerId === user?.id || c.status === 'published'
      );
      setTrainerCourses(myCourses.length > 0 ? myCourses : coursesData || []);
    } catch (err) {
      console.error('Failed to load trainer assessments:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add blank question draft
  const addBlankQuestion = () => {
    setQuestionDrafts(prev => [
      ...prev,
      { questionText: '', options: ['', '', '', ''], correctOptionIndex: 0, explanation: '' }
    ]);
  };

  // Update a question draft
  const updateDraft = (idx: number, field: string, value: any) => {
    setQuestionDrafts(prev => {
      const copy = [...prev];
      (copy[idx] as any)[field] = value;
      return copy;
    });
  };

  // Update a draft option
  const updateDraftOption = (qIdx: number, oIdx: number, value: string) => {
    setQuestionDrafts(prev => {
      const copy = [...prev];
      copy[qIdx].options[oIdx] = value;
      return copy;
    });
  };

  // Remove a draft question
  const removeDraft = (idx: number) => {
    setQuestionDrafts(prev => prev.filter((_, i) => i !== idx));
  };

  // AI Generate Questions
  const handleAiGenerate = async () => {
    const course = trainerCourses.find((c: any) => c.id === selectedCourseId);
    if (!course) {
      showToast('Please select a course first');
      return;
    }
    try {
      setAiGenerating(true);
      const result = await courseService.aiGenerateQuestions({
        courseId: selectedCourseId,
        subject: course.subject || 'Meteorology',
        competencyName: course.competenciesCovered?.[0] || course.subject || 'Operational Meteorology'
      });
      const generated = (result.questions || []).map((q: any) => ({
        questionText: q.questionText || '',
        options: q.options || ['', '', '', ''],
        correctOptionIndex: q.correctOptionIndex || 0,
        explanation: q.explanation || ''
      }));
      setQuestionDrafts(prev => [...prev, ...generated]);
      showToast(`AI generated ${generated.length} questions! Review and edit them below.`);
    } catch (err: any) {
      showToast(err.message || 'AI generation failed. Add questions manually.');
    } finally {
      setAiGenerating(false);
    }
  };

  // Create Assessment
  const handleCreateAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId) {
      showToast('Please select a course');
      return;
    }
    if (questionDrafts.length === 0) {
      showToast('Add at least one question');
      return;
    }
    // Validate all questions have text and at least 2 options
    const valid = questionDrafts.every(q => q.questionText.trim() && q.options.filter(o => o.trim()).length >= 2);
    if (!valid) {
      showToast('Each question must have text and at least 2 options filled');
      return;
    }

    try {
      setCreating(true);
      await courseService.createAssessment({
        courseId: selectedCourseId,
        title: title || 'New Assessment',
        durationMinutes: duration,
        passingScore,
        difficulty,
        dueDate: dueDate || undefined,
        retakeAllowed,
        questions: questionDrafts
      });
      showToast('Assessment created successfully with questions!');
      setShowCreateModal(false);
      resetCreateForm();
      await loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to create assessment');
    } finally {
      setCreating(false);
    }
  };

  const resetCreateForm = () => {
    setTitle('');
    setSelectedCourseId('');
    setDuration(45);
    setPassingScore(75);
    setDifficulty('Medium');
    setDueDate('');
    setRetakeAllowed(true);
    setQuestionDrafts([]);
  };

  // Open Question Bank Editor
  const openQuestionBank = async (asm: any) => {
    setEditingAssessment(asm);
    try {
      setLoadingEditQuestions(true);
      const questions = await courseService.getTrainerAssessmentQuestions(asm.id);
      setEditQuestions(questions || []);
    } catch (err) {
      showToast('Failed to load questions');
    } finally {
      setLoadingEditQuestions(false);
    }
  };

  // Save edited question
  const handleSaveQuestion = async (question: any) => {
    try {
      setSavingQuestion(question._id);
      await courseService.updateQuestion(question._id, {
        questionText: question.questionText,
        options: question.options,
        correctOptionIndex: question.correctOptionIndex,
        explanation: question.explanation
      });
      showToast('Question updated!');
    } catch (err: any) {
      showToast(err.message || 'Failed to update question');
    } finally {
      setSavingQuestion(null);
    }
  };

  // Delete question
  const handleDeleteQuestion = async (questionId: string) => {
    try {
      await courseService.deleteQuestion(questionId);
      setEditQuestions(prev => prev.filter(q => q._id !== questionId));
      showToast('Question deleted');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete question');
    }
  };

  // Update edit question field
  const updateEditQuestion = (qId: string, field: string, value: any) => {
    setEditQuestions(prev => prev.map(q => q._id === qId ? { ...q, [field]: value } : q));
  };

  const updateEditOption = (qId: string, oIdx: number, value: string) => {
    setEditQuestions(prev => prev.map(q => {
      if (q._id !== qId) return q;
      const newOptions = [...q.options];
      newOptions[oIdx] = value;
      return { ...q, options: newOptions };
    }));
  };

  // AI Generate more questions for existing assessment
  const handleAiGenerateForExisting = async () => {
    if (!editingAssessment) return;
    const course = trainerCourses.find((c: any) => c.id === editingAssessment.courseId?.toString());
    try {
      setAiGenerating(true);
      const result = await courseService.aiGenerateQuestions({
        assessmentId: editingAssessment.id,
        courseId: editingAssessment.courseId,
        subject: course?.subject || 'Meteorology',
        competencyName: course?.competenciesCovered?.[0] || 'Operational Meteorology'
      });
      // Reload questions
      const updatedQuestions = await courseService.getTrainerAssessmentQuestions(editingAssessment.id);
      setEditQuestions(updatedQuestions || []);
      showToast(`AI generated ${result.questions?.length || 0} new questions and saved them!`);
    } catch (err: any) {
      showToast(err.message || 'AI generation failed');
    } finally {
      setAiGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
        <span className="ml-3 text-sm text-slate-300">Loading Assessments...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-emerald-400" />
            <span>Assessment Authoring & Question Bank</span>
          </h2>
          <p className="text-xs text-slate-400">Build MCQ tests with manual or AI-generated questions, configure timers, and manage question banks.</p>
        </div>

        <button
          onClick={() => { resetCreateForm(); setShowCreateModal(true); }}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-500 transition-all"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Create MCQ Quiz</span>
        </button>
      </div>

      {/* Grid */}
      {assessments.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/40 p-12 text-center">
          <FileText className="mx-auto h-10 w-10 text-slate-500 mb-3" />
          <h3 className="text-base font-bold text-white">No Assessments Created Yet</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto mb-4">
            Create your first MCQ assessment for your courses. You can add questions manually or use AI to auto-generate them.
          </p>
          <button
            onClick={() => { resetCreateForm(); setShowCreateModal(true); }}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-lg shadow-emerald-500/20"
          >
            Create First Assessment
          </button>
        </div>
      ) : (
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
                  onClick={() => openQuestionBank(asm)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700"
                >
                  Edit Question Bank
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========== CREATE ASSESSMENT MODAL ========== */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New MCQ Assessment"
        subtitle="Select a course, configure settings, then add questions manually or via AI."
        maxWidth="4xl"
      >
        <form onSubmit={handleCreateAssessment} className="space-y-5 text-xs max-h-[70vh] overflow-y-auto pr-1">
          {/* Assessment Settings */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="h-4 w-4 text-emerald-400" />
              Assessment Settings
            </h4>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Assessment Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded border border-slate-800 bg-slate-900 p-2.5 text-white"
                placeholder="e.g. Doppler Velocity & Radial Shear Diagnostic Test"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Link to Course *</label>
              <select
                required
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full rounded border border-slate-800 bg-slate-900 p-2.5 text-white"
              >
                <option value="">Select a course...</option>
                {trainerCourses.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.code} — {c.title}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Time (mins)</label>
                <input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="w-full rounded border border-slate-800 bg-slate-900 p-2.5 text-white" />
              </div>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Pass Score (%)</label>
                <input type="number" value={passingScore} onChange={(e) => setPassingScore(Number(e.target.value))} className="w-full rounded border border-slate-800 bg-slate-900 p-2.5 text-white" />
              </div>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Difficulty</label>
                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as any)} className="w-full rounded border border-slate-800 bg-slate-900 p-2.5 text-white">
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Due Date</label>
                <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full rounded border border-slate-800 bg-slate-900 p-2.5 text-white" />
              </div>
            </div>

            <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
              <input type="checkbox" checked={retakeAllowed} onChange={(e) => setRetakeAllowed(e.target.checked)} className="rounded" />
              <span>Allow Retake</span>
            </label>
          </div>

          {/* Question Builder */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-cyan-400" />
                Questions ({questionDrafts.length})
              </h4>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleAiGenerate}
                  disabled={aiGenerating || !selectedCourseId}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold disabled:opacity-50 shadow-md shadow-purple-500/20"
                >
                  {aiGenerating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                  {aiGenerating ? 'Generating...' : 'AI Generate Questions'}
                </button>
                <button
                  type="button"
                  onClick={addBlankQuestion}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-bold border border-slate-700"
                >
                  <PlusCircle className="h-3 w-3" />
                  Add Manual
                </button>
              </div>
            </div>

            {questionDrafts.length === 0 && (
              <p className="text-center text-slate-500 py-4">
                No questions yet. Click "AI Generate Questions" or "Add Manual" above.
              </p>
            )}

            <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
              {questionDrafts.map((q, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-cyan-400 uppercase">Question {idx + 1}</span>
                    <button type="button" onClick={() => removeDraft(idx)} className="text-red-400 hover:text-red-300">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <input
                    type="text"
                    value={q.questionText}
                    onChange={(e) => updateDraft(idx, 'questionText', e.target.value)}
                    placeholder="Enter question text..."
                    className="w-full rounded border border-slate-800 bg-slate-950 p-2 text-white text-xs"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    {q.options.map((opt, oIdx) => (
                      <div key={oIdx} className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => updateDraft(idx, 'correctOptionIndex', oIdx)}
                          className={`flex-shrink-0 h-5 w-5 rounded-full border text-[9px] font-bold flex items-center justify-center ${
                            q.correctOptionIndex === oIdx
                              ? 'border-emerald-400 bg-emerald-500 text-white'
                              : 'border-slate-700 text-slate-500'
                          }`}
                        >
                          {String.fromCharCode(65 + oIdx)}
                        </button>
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => updateDraftOption(idx, oIdx, e.target.value)}
                          placeholder={`Option ${String.fromCharCode(65 + oIdx)}`}
                          className="flex-1 rounded border border-slate-800 bg-slate-950 p-1.5 text-white text-[10px]"
                        />
                      </div>
                    ))}
                  </div>

                  <input
                    type="text"
                    value={q.explanation}
                    onChange={(e) => updateDraft(idx, 'explanation', e.target.value)}
                    placeholder="Explanation for correct answer (optional)"
                    className="w-full rounded border border-slate-800 bg-slate-950 p-1.5 text-white text-[10px]"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 rounded-lg bg-slate-800 text-slate-400 text-xs">
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating || questionDrafts.length === 0}
              className="px-5 py-2 rounded-lg bg-emerald-600 font-bold text-white text-xs disabled:opacity-50 flex items-center gap-2"
            >
              {creating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />}
              {creating ? 'Creating...' : `Create Assessment (${questionDrafts.length} Questions)`}
            </button>
          </div>
        </form>
      </Modal>

      {/* ========== QUESTION BANK EDITOR MODAL ========== */}
      {editingAssessment && (
        <Modal
          isOpen={!!editingAssessment}
          onClose={() => setEditingAssessment(null)}
          title={`Question Bank: ${editingAssessment.title}`}
          subtitle={`${editingAssessment.courseTitle} • ${editQuestions.length} Questions`}
          maxWidth="4xl"
        >
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            {/* Actions Bar */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-400">
                {editQuestions.length} questions in bank
              </span>
              <button
                onClick={handleAiGenerateForExisting}
                disabled={aiGenerating}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold disabled:opacity-50"
              >
                {aiGenerating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                {aiGenerating ? 'Generating...' : 'Add AI Questions'}
              </button>
            </div>

            {loadingEditQuestions ? (
              <div className="py-8 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-400 mx-auto" />
                <p className="text-xs text-slate-400 mt-2">Loading question bank...</p>
              </div>
            ) : editQuestions.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                <p>No questions in this assessment yet. Use "Add AI Questions" to generate some.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {editQuestions.map((q, idx) => (
                  <div key={q._id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-cyan-400 uppercase">Question {idx + 1}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveQuestion(q)}
                          disabled={savingQuestion === q._id}
                          className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 text-[10px] font-bold disabled:opacity-50"
                        >
                          {savingQuestion === q._id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                          Save
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(q._id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <textarea
                      value={q.questionText}
                      onChange={(e) => updateEditQuestion(q._id, 'questionText', e.target.value)}
                      className="w-full rounded border border-slate-800 bg-slate-950 p-2 text-white text-xs resize-none"
                      rows={2}
                    />

                    <div className="grid grid-cols-2 gap-2">
                      {(q.options || []).map((opt: string, oIdx: number) => (
                        <div key={oIdx} className="flex items-center gap-1">
                          <button
                            onClick={() => updateEditQuestion(q._id, 'correctOptionIndex', oIdx)}
                            className={`flex-shrink-0 h-5 w-5 rounded-full border text-[9px] font-bold flex items-center justify-center ${
                              q.correctOptionIndex === oIdx
                                ? 'border-emerald-400 bg-emerald-500 text-white'
                                : 'border-slate-700 text-slate-500 hover:border-slate-600'
                            }`}
                          >
                            {String.fromCharCode(65 + oIdx)}
                          </button>
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => updateEditOption(q._id, oIdx, e.target.value)}
                            className="flex-1 rounded border border-slate-800 bg-slate-950 p-1.5 text-white text-[10px]"
                          />
                        </div>
                      ))}
                    </div>

                    <input
                      type="text"
                      value={q.explanation || ''}
                      onChange={(e) => updateEditQuestion(q._id, 'explanation', e.target.value)}
                      placeholder="Explanation"
                      className="w-full rounded border border-slate-800 bg-slate-950 p-1.5 text-white text-[10px]"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

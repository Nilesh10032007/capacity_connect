import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { courseService } from '../../../services/api/courseService';
import { FileText, PlusCircle, HelpCircle, Sparkles, Loader2, Save, X, Trash2 } from 'lucide-react';

interface QuestionDraft {
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

interface AssessmentEditorViewProps {
  onClose: () => void;
  onSuccess: () => void;
  trainerCourses: any[];
}

export const AssessmentEditorView: React.FC<AssessmentEditorViewProps> = ({ onClose, onSuccess, trainerCourses }) => {
  const { showToast } = useApp();

  const [title, setTitle] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [duration, setDuration] = useState(45);
  const [passingScore, setPassingScore] = useState(75);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [dueDate, setDueDate] = useState('');
  const [retakeAllowed, setRetakeAllowed] = useState(true);
  
  const [creating, setCreating] = useState(false);
  const [questionDrafts, setQuestionDrafts] = useState<QuestionDraft[]>([]);
  const [aiGenerating, setAiGenerating] = useState(false);

  const addBlankQuestion = () => {
    setQuestionDrafts(prev => [
      ...prev,
      { questionText: '', options: ['', '', '', ''], correctOptionIndex: 0, explanation: '' }
    ]);
  };

  const updateDraft = (idx: number, field: string, value: any) => {
    setQuestionDrafts(prev => {
      const copy = [...prev];
      (copy[idx] as any)[field] = value;
      return copy;
    });
  };

  const updateDraftOption = (qIdx: number, oIdx: number, value: string) => {
    setQuestionDrafts(prev => {
      const copy = [...prev];
      copy[qIdx].options[oIdx] = value;
      return copy;
    });
  };

  const removeDraft = (idx: number) => {
    setQuestionDrafts(prev => prev.filter((_, i) => i !== idx));
  };

  const handleAiGenerate = async () => {
    const course = trainerCourses.find((c: any) => c.id === selectedCourseId || c._id === selectedCourseId);
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
      showToast('Assessment created successfully!');
      onSuccess();
    } catch (err: any) {
      showToast(err.message || 'Failed to create assessment');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-5xl mx-auto pb-12">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <FileText className="h-6 w-6 text-emerald-600" />
              <span>Create MCQ Assessment</span>
            </h2>
            <p className="text-sm text-slate-500 mt-1">Configure assessment details and build your question bank.</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleCreateAssessment} className="space-y-8">
          
          {/* Settings Section */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">Assessment Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Assessment Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none shadow-sm"
                  placeholder="e.g. Doppler Velocity & Radial Shear Diagnostic Test"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Link to Course *</label>
                <select
                  required
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none shadow-sm"
                >
                  <option value="">Select a course...</option>
                  {trainerCourses.map((c: any) => (
                    <option key={c.id || c._id} value={c.id || c._id}>{c.code} — {c.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Due Date</label>
                <input 
                  type="date" 
                  value={dueDate} 
                  onChange={(e) => setDueDate(e.target.value)} 
                  className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none shadow-sm" 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Time (mins)</label>
                <input 
                  type="number" 
                  value={duration} 
                  onChange={(e) => setDuration(Number(e.target.value))} 
                  className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none shadow-sm" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Pass Score (%)</label>
                <input 
                  type="number" 
                  value={passingScore} 
                  onChange={(e) => setPassingScore(Number(e.target.value))} 
                  className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none shadow-sm" 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Difficulty</label>
                <select 
                  value={difficulty} 
                  onChange={(e) => setDifficulty(e.target.value as any)} 
                  className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none shadow-sm"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div className="flex items-center pt-8">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={retakeAllowed} 
                    onChange={(e) => setRetakeAllowed(e.target.checked)} 
                    className="rounded text-emerald-600 focus:ring-emerald-500 h-5 w-5" 
                  />
                  <span className="text-sm font-semibold text-slate-700">Allow Retakes (One-time attempt if unchecked)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Question Builder */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-indigo-500" />
                Question Bank ({questionDrafts.length})
              </h3>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleAiGenerate}
                  disabled={aiGenerating || !selectedCourseId}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold disabled:opacity-50 transition-all shadow-md shadow-indigo-600/20"
                >
                  {aiGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  {aiGenerating ? 'Generating...' : 'AI Auto-Generate'}
                </button>
                <button
                  type="button"
                  onClick={addBlankQuestion}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-bold transition-all"
                >
                  <PlusCircle className="h-4 w-4 text-emerald-600" />
                  Add Manual
                </button>
              </div>
            </div>

            <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
              {questionDrafts.map((q, idx) => (
                <div key={idx} className="relative p-5 rounded-xl border border-slate-200 bg-slate-50 shadow-sm">
                  <button
                    type="button"
                    onClick={() => removeDraft(idx)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>

                  <div className="space-y-4 pr-8">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Question {idx + 1}</label>
                      <textarea
                        value={q.questionText}
                        onChange={(e) => updateDraft(idx, 'questionText', e.target.value)}
                        placeholder="Enter the question..."
                        rows={2}
                        className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {q.options.map((opt, oIdx) => (
                        <div key={oIdx} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`correct-${idx}`}
                            checked={q.correctOptionIndex === oIdx}
                            onChange={() => updateDraft(idx, 'correctOptionIndex', oIdx)}
                            className="text-emerald-600 focus:ring-emerald-500"
                          />
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => updateDraftOption(idx, oIdx, e.target.value)}
                            placeholder={`Option ${oIdx + 1}`}
                            className={`w-full rounded border p-2 text-sm focus:outline-none ${q.correctOptionIndex === oIdx ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300 bg-white'}`}
                            required
                          />
                        </div>
                      ))}
                    </div>

                    <div>
                      <input
                        type="text"
                        value={q.explanation}
                        onChange={(e) => updateDraft(idx, 'explanation', e.target.value)}
                        placeholder="Explanation for the correct answer (optional)"
                        className="w-full rounded border border-slate-200 bg-white p-2 text-xs text-slate-600 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              {questionDrafts.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                  <p className="text-slate-500 font-medium">No questions added yet.</p>
                  <p className="text-sm text-slate-400 mt-1">Use the buttons above to start building your test.</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4 sticky bottom-0 bg-slate-50 p-4 border-t border-slate-200 rounded-t-xl z-10">
            <button 
              type="button" 
              onClick={onClose}
              className="px-6 py-3 rounded-lg font-bold text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={creating}
              className="px-6 py-3 rounded-lg font-bold text-white bg-emerald-600 hover:bg-emerald-500 flex items-center gap-2 shadow-lg shadow-emerald-600/20 disabled:opacity-70 transition-all"
            >
              <Save className="h-5 w-5" />
              <span>{creating ? 'Creating Assessment...' : 'Save & Publish Assessment'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

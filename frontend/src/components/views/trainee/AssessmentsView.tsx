import React, { useState, useEffect } from 'react';
import { Badge } from '../../common/Badge';
import { Modal } from '../../common/Modal';
import { useApp } from '../../../context/AppContext';
import { Assessment } from '../../../types';
import { FileText, Clock, CheckCircle2, AlertCircle, RefreshCw, Award, Loader2 } from 'lucide-react';
import { courseService } from '../../../services/api/courseService';

export const AssessmentsView: React.FC = () => {
  const { showToast } = useApp();
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Quiz state
  const [activeQuiz, setActiveQuiz] = useState<any | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizFinished, setQuizFinished] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const loadAssessments = async () => {
    try {
      setLoading(true);
      const data = await courseService.getAllMyAssessments();
      setAssessments(data || []);
    } catch (err) {
      console.error('Failed to load assessments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssessments();
  }, []);

  const startQuiz = async (asm: any) => {
    setActiveQuiz(asm);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setQuizFinished(false);
    setFinalScore(0);

    // Fetch questions from backend
    try {
      setLoadingQuestions(true);
      const questions = await courseService.getAssessmentQuestions(asm.id);
      setQuizQuestions(questions || []);
    } catch (err) {
      showToast('Failed to load assessment questions.');
      setActiveQuiz(null);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  const finishQuiz = async () => {
    if (!activeQuiz || quizQuestions.length === 0) return;

    try {
      setSubmitting(true);
      const result = await courseService.submitAssessment(activeQuiz.id, selectedAnswers);
      setFinalScore(result.score || 0);
      setQuizFinished(true);

      // Reload assessments to reflect updated status
      await loadAssessments();
      showToast(`Assessment submitted! Score: ${result.score}% — ${result.status === 'passed' ? 'Passed!' : 'Try again.'}`);
    } catch (err: any) {
      showToast(err.message || 'Error submitting assessment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
        <span className="ml-3 text-sm text-slate-300">Loading Assessments from Backend...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-cyan-400" />
            <span>Competency Assessments & Examinations</span>
          </h2>
          <p className="text-xs text-slate-400">Formal evaluations assigned by your trainer for institutional competency certifications.</p>
        </div>
      </div>

      {/* Assessment Cards Grid */}
      {assessments.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/40 p-12 text-center">
          <FileText className="mx-auto h-10 w-10 text-slate-500 mb-3" />
          <h3 className="text-base font-bold text-white">No Assessments Available</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            When your trainer creates an assessment for a course you're enrolled in, it will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {assessments.map((asm) => {
            const isCompleted = asm.status === 'completed';

            return (
              <div
                key={asm.id}
                className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant={isCompleted ? 'emerald' : asm.status === 'upcoming' ? 'amber' : 'cyan'}>
                      {asm.status.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-slate-500" />
                      {asm.durationMinutes} mins
                    </span>
                  </div>

                  <h3 className="mt-3 text-base font-bold text-white leading-snug">{asm.title}</h3>
                  <p className="text-xs text-cyan-400 mt-1 font-semibold">{asm.courseTitle}</p>

                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-center">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Questions</span>
                      <span className="font-bold text-white">{asm.totalQuestions} Questions</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Passing Threshold</span>
                      <span className="font-bold text-emerald-400">{asm.passingScore}%</span>
                    </div>
                  </div>
                </div>

                {/* Action / Results Footer */}
                <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
                  {isCompleted ? (
                    <div className="w-full flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase block font-semibold">Your Score</span>
                        <span className="text-sm font-extrabold text-emerald-400">{asm.userScore}% (Passed)</span>
                      </div>
                      {asm.retakeAllowed && (
                        <button
                          onClick={() => startQuiz(asm)}
                          className="flex items-center gap-1 text-xs text-cyan-400 hover:underline font-semibold"
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                          <span>Retake Test</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => startQuiz(asm)}
                      className="w-full flex items-center justify-center gap-2 rounded-lg bg-cyan-600 py-2 text-xs font-bold text-white hover:bg-cyan-500 shadow-md shadow-cyan-500/20 transition-all"
                    >
                      <span>Begin Assessment</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Interactive Exam Modal */}
      {activeQuiz && (
        <Modal
          isOpen={!!activeQuiz}
          onClose={() => setActiveQuiz(null)}
          title={activeQuiz.title}
          subtitle={`Duration: ${activeQuiz.durationMinutes} mins • Total Questions: ${quizQuestions.length}`}
          maxWidth="2xl"
        >
          {loadingQuestions ? (
            <div className="py-12 text-center space-y-3">
              <Loader2 className="h-10 w-10 animate-spin text-cyan-400 mx-auto" />
              <p className="text-sm text-slate-300">Loading assessment questions...</p>
            </div>
          ) : quizFinished ? (
            <div className="py-6 text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-white">Assessment Submitted</h3>
              <p className="text-xs text-slate-300">
                Final Score Achieved: <span className="text-lg font-extrabold text-emerald-400">{finalScore}%</span>
              </p>
              <p className="text-xs text-slate-400">
                {finalScore >= activeQuiz.passingScore
                  ? 'Congratulations! You passed! A certificate has been issued to your Certificates tab.'
                  : 'Score below passing threshold. Review course modules and retake.'}
              </p>
              <button
                onClick={() => setActiveQuiz(null)}
                className="mt-4 px-6 py-2 rounded-lg bg-slate-800 text-xs font-bold text-white hover:bg-slate-700"
              >
                Close Examination
              </button>
            </div>
          ) : quizQuestions.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-400">
              <p>No questions found for this assessment. The trainer has not added questions yet.</p>
              <button
                onClick={() => setActiveQuiz(null)}
                className="mt-3 px-4 py-2 rounded bg-slate-800 text-white text-xs"
              >
                Close
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Question Stepper */}
              <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
                <span>
                  Question <strong className="text-cyan-400">{currentQuestionIndex + 1}</strong> of {quizQuestions.length}
                </span>
                <span className="font-mono text-cyan-400">
                  {Math.round(((currentQuestionIndex + 1) / quizQuestions.length) * 100)}% Complete
                </span>
              </div>

              {/* Question Text */}
              <h4 className="text-sm font-bold text-white leading-relaxed">
                {quizQuestions[currentQuestionIndex].questionText}
              </h4>

              {/* Options */}
              <div className="space-y-2 pt-2">
                {quizQuestions[currentQuestionIndex].options.map((opt: string, oIdx: number) => {
                  const qId = quizQuestions[currentQuestionIndex]._id;
                  const isSelected = selectedAnswers[qId] === oIdx;
                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSelectOption(qId, oIdx)}
                      className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left text-xs transition-all ${
                        isSelected
                          ? 'border-cyan-500 bg-cyan-500/10 text-white font-semibold'
                          : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${
                        isSelected ? 'border-cyan-400 bg-cyan-500 text-slate-950' : 'border-slate-700 text-slate-400'
                      }`}>
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Nav buttons */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                <button
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                  className="px-4 py-2 text-xs rounded-lg bg-slate-800 text-slate-300 disabled:opacity-40"
                >
                  Previous
                </button>

                {currentQuestionIndex === quizQuestions.length - 1 ? (
                  <button
                    onClick={finishQuiz}
                    disabled={submitting}
                    className="px-6 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                  >
                    {submitting ? 'Submitting...' : 'Submit Exam'}
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                    className="px-6 py-2 text-xs font-bold rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white"
                  >
                    Next Question
                  </button>
                )}
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

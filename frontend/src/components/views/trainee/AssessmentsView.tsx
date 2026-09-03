import React, { useState } from 'react';
import { MOCK_ASSESSMENTS } from '../../../services/mockData';
import { Badge } from '../../common/Badge';
import { Modal } from '../../common/Modal';
import { useApp } from '../../../context/AppContext';
import { Assessment } from '../../../types';
import { FileText, Clock, CheckCircle2, AlertCircle, RefreshCw, Award } from 'lucide-react';
import { courseService } from '../../../services/api/courseService';

export const AssessmentsView: React.FC = () => {
  const { showToast } = useApp();
  const [assessments, setAssessments] = useState<Assessment[]>(MOCK_ASSESSMENTS);
  const [activeQuiz, setActiveQuiz] = useState<Assessment | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizFinished, setQuizFinished] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const startQuiz = (asm: Assessment) => {
    setActiveQuiz(asm);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setQuizFinished(false);
  };

  const handleSelectOption = (questionIdx: number, optionIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionIdx]: optionIdx }));
  };

  const finishQuiz = async () => {
    if (!activeQuiz || !activeQuiz.questions) return;
    let correct = 0;
    activeQuiz.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctOptionIndex) {
        correct++;
      }
    });
    const scorePct = Math.round((correct / activeQuiz.questions.length) * 100);
    setFinalScore(scorePct);
    setQuizFinished(true);

    await courseService.submitAssessmentScore(activeQuiz.id, scorePct);
    const updated = await courseService.getAssessments();
    setAssessments(updated);
    showToast(`Assessment submitted! Score: ${scorePct}%`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-cyan-400" />
            <span>Competency Assessments & Examinations</span>
          </h2>
          <p className="text-xs text-slate-400">Formal evaluations required for institutional competency level certifications.</p>
        </div>
      </div>

      {/* Assessment Cards Grid */}
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

      {/* Interactive Exam Modal */}
      {activeQuiz && (
        <Modal
          isOpen={!!activeQuiz}
          onClose={() => setActiveQuiz(null)}
          title={activeQuiz.title}
          subtitle={`Duration: ${activeQuiz.durationMinutes} mins • Total Questions: ${activeQuiz.questions?.length || 0}`}
          maxWidth="2xl"
        >
          {quizFinished ? (
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
                  ? 'Congratulations! You passed the competency assessment threshold.'
                  : 'Score below passing threshold. Review course modules and retake.'}
              </p>
              <button
                onClick={() => setActiveQuiz(null)}
                className="mt-4 px-6 py-2 rounded-lg bg-slate-800 text-xs font-bold text-white hover:bg-slate-700"
              >
                Close Examination
              </button>
            </div>
          ) : activeQuiz.questions && activeQuiz.questions[currentQuestionIndex] ? (
            <div className="space-y-4">
              {/* Question Stepper */}
              <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
                <span>
                  Question <strong className="text-cyan-400">{currentQuestionIndex + 1}</strong> of {activeQuiz.questions.length}
                </span>
                <span className="font-mono text-amber-400">Time Remaining: 38:42</span>
              </div>

              {/* Question Text */}
              <h4 className="text-sm font-bold text-white leading-relaxed">
                {activeQuiz.questions[currentQuestionIndex].questionText}
              </h4>

              {/* Options */}
              <div className="space-y-2 pt-2">
                {activeQuiz.questions[currentQuestionIndex].options.map((opt, oIdx) => {
                  const isSelected = selectedAnswers[currentQuestionIndex] === oIdx;
                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSelectOption(currentQuestionIndex, oIdx)}
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

                {currentQuestionIndex === activeQuiz.questions.length - 1 ? (
                  <button
                    onClick={finishQuiz}
                    className="px-6 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                  >
                    Submit Exam
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
          ) : (
            <div className="py-6 text-center text-xs text-slate-400">Loading questions...</div>
          )}
        </Modal>
      )}
    </div>
  );
};

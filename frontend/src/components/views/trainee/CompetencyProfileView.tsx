import React, { useState, useEffect } from 'react';
import { Badge } from '../../common/Badge';
import { useApp } from '../../../context/AppContext';
import { Target, Loader2, Edit3, Sparkles, CheckCircle2, XCircle, ArrowLeft, ArrowRight, Award, HelpCircle, LayoutDashboard, Compass, X } from 'lucide-react';
import { Competency } from '../../../types';
import { traineeService } from '../../../services/api/traineeService';

interface QuizQuestion {
  id: number;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export const CompetencyProfileView: React.FC = () => {
  const { showToast, setActiveTab } = useApp();
  const [competencies, setCompetencies] = useState<Competency[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Full Screen Assessment State
  const [selectedComp, setSelectedComp] = useState<Competency | null>(null);
  const [viewMode, setViewMode] = useState<'choice' | 'manual' | 'quiz' | 'quiz-result'>('choice');

  // Manual Level State
  const [newLevel, setNewLevel] = useState<number>(1);
  const [savingManual, setSavingManual] = useState<boolean>(false);

  // AI Quiz State
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [loadingQuiz, setLoadingQuiz] = useState<boolean>(false);
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [detectedLevel, setDetectedLevel] = useState<number>(1);

  const loadCompetencies = async () => {
    try {
      setLoading(true);
      const data = await traineeService.getCompetencies();
      setCompetencies(data || []);
    } catch (err) {
      console.error('Failed to load competencies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompetencies();
  }, []);

  const openAssessmentModal = (comp: Competency) => {
    setSelectedComp(comp);
    setNewLevel(comp.currentLevel || 1);
    setViewMode('choice');
    setUserAnswers([]);
    setCurrentQIndex(0);
  };

  const handleSaveManualLevel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComp) return;

    try {
      setSavingManual(true);
      await traineeService.updateCompetencyLevel(selectedComp.id, newLevel);
      showToast(`Updated "${selectedComp.name}" level to Level ${newLevel}! Gap updated.`);
      setSelectedComp(null);
      loadCompetencies();
    } catch (err: any) {
      showToast(err.message || 'Error updating level');
    } finally {
      setSavingManual(false);
    }
  };

  const handleStartAIQuiz = async () => {
    if (!selectedComp) return;
    try {
      setViewMode('quiz');
      setLoadingQuiz(true);
      const res = await traineeService.generateQuiz(selectedComp.name, selectedComp.category);
      if (res && res.questions && res.questions.length > 0) {
        setQuizQuestions(res.questions);
        setUserAnswers(new Array(res.questions.length).fill(-1));
        setCurrentQIndex(0);
      } else {
        throw new Error('No quiz questions generated');
      }
    } catch (err: any) {
      showToast('Error generating AI Quiz questions. Please try again.');
      setViewMode('choice');
    } finally {
      setLoadingQuiz(false);
    }
  };

  const handleSelectOption = (optIndex: number) => {
    const updated = [...userAnswers];
    updated[currentQIndex] = optIndex;
    setUserAnswers(updated);
  };

  const handleFinishQuiz = async () => {
    if (!selectedComp) return;

    let correctCount = 0;
    quizQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctOptionIndex) {
        correctCount++;
      }
    });

    const scorePercentage = Math.round((correctCount / quizQuestions.length) * 100);
    setQuizScore(scorePercentage);

    let calculatedLvl = 1;
    if (correctCount >= 6) calculatedLvl = 5;
    else if (correctCount === 5) calculatedLvl = 4;
    else if (correctCount >= 3) calculatedLvl = 3;
    else if (correctCount === 2) calculatedLvl = 2;

    setDetectedLevel(calculatedLvl);
    setViewMode('quiz-result');

    try {
      await traineeService.updateCompetencyLevel(selectedComp.id, calculatedLvl);
      showToast(`AI Quiz Completed! Level ${calculatedLvl} detected & saved.`);
      loadCompetencies();
    } catch (err: any) {
      console.error('Failed to save quiz detected level:', err);
    }
  };

  const totalCompetencies = competencies.length;
  const targetMetCount = competencies.filter((c) => c.gap <= 0).length;
  const highGapCount = competencies.filter((c) => c.gap >= 2).length;

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
        <span className="ml-3 text-sm text-slate-700 font-bold">Loading Live Competencies...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-slate-50 min-h-screen rounded-2xl p-4 sm:p-6" style={{ backgroundColor: '#f8fafc' }}>
      {/* Header & Stats Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Target className="h-5 w-5 text-cyan-600" />
            <span>My Competency Profile</span>
          </h2>
          <p className="text-xs text-slate-600">Assess your current proficiency level or take an AI-powered quiz to detect your skill level.</p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="rounded-lg bg-white border border-slate-200 px-3 py-1.5 shadow-sm">
            <span className="text-slate-600">Assessed:</span> <span className="font-bold text-slate-900">{totalCompetencies} Competencies</span>
          </div>
          <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-emerald-700 font-semibold shadow-sm">
            {targetMetCount} Targets Met
          </div>
          <div className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-1.5 text-amber-700 font-semibold shadow-sm">
            {highGapCount} Gaps Identified
          </div>
        </div>
      </div>

      {/* Competencies Grid */}
      {competencies.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
          <Target className="mx-auto h-10 w-10 text-slate-400 mb-3" />
          <h3 className="text-base font-bold text-slate-900">No Competencies Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            When Admin creates a course with a required competency, it will appear here automatically for level assessment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {competencies.map((comp) => {
            const isMet = comp.gap <= 0;
            const progressPercent = Math.min(100, Math.round((comp.currentLevel / comp.requiredLevel) * 100));

            return (
              <div
                key={comp.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant={isMet ? 'emerald' : comp.gap >= 2 ? 'rose' : 'amber'}>
                      {comp.category}
                    </Badge>
                    <span className="text-[10px] text-slate-500 font-mono">Assessed {comp.lastAssessedDate}</span>
                  </div>

                  <h3 className="mt-3 text-base font-extrabold text-slate-900 leading-snug" style={{ color: '#0f172a' }}>{comp.name}</h3>
                  <p className="mt-1 text-xs text-slate-600 line-clamp-2">{comp.description}</p>

                  {/* Level Metrics Card (Forced Light Theme) */}
                  <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-slate-50 p-3.5 border border-slate-200 text-center shadow-inner">
                    <div>
                      <span className="block text-[10px] text-slate-500 uppercase font-extrabold">Current</span>
                      <span className="text-sm font-extrabold text-cyan-700">
                        {comp.currentLevel > 0 ? `Level ${comp.currentLevel}` : 'Not Set'}
                      </span>
                    </div>
                    <div className="border-x border-slate-200">
                      <span className="block text-[10px] text-slate-500 uppercase font-extrabold">Required</span>
                      <span className="text-sm font-extrabold text-slate-900" style={{ color: '#0f172a' }}>Level {comp.requiredLevel}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-500 uppercase font-extrabold">Skill Gap</span>
                      <span className={`text-sm font-extrabold ${isMet ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {isMet ? 'None' : `-${comp.gap}`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar & Assess Button */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-600 font-semibold">Target Competency Ratio</span>
                    <span className="font-extrabold text-slate-900">{progressPercent}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isMet ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-400 to-rose-400'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  <button
                    onClick={() => openAssessmentModal(comp)}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white py-3 px-4 text-xs font-extrabold transition-all shadow-sm cursor-pointer"
                    style={{ backgroundColor: '#0891b2', color: '#ffffff' }}
                  >
                    <Sparkles className="h-4 w-4 text-white" />
                    <span>Set / Assess My Current Level</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TRUE FULL-SCREEN OVERLAY (Forced Light Theme) */}
      {selectedComp && (
        <div className="fixed inset-0 z-[100] bg-slate-50 text-slate-900 overflow-y-auto flex flex-col p-4 sm:p-8 md:p-10 animate-in fade-in duration-150" style={{ backgroundColor: '#f8fafc' }}>
          
          {/* Top Sticky Header */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-5 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-extrabold mb-2 shadow-sm">
                <Target className="h-4 w-4 text-cyan-600" />
                <span>Level Assessment & Detection</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 leading-tight" style={{ color: '#0f172a' }}>
                {selectedComp.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Category: <span className="text-slate-900 font-bold">{selectedComp.category}</span> • Admin Target Level: <span className="text-cyan-700 font-extrabold">Level {selectedComp.requiredLevel}</span>
              </p>
            </div>

            <button
              onClick={() => setSelectedComp(null)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-extrabold text-xs shadow-sm border border-slate-200 transition-all shrink-0 cursor-pointer"
              style={{ color: '#1e293b' }}
            >
              <X className="h-5 w-5 text-slate-800" />
              <span>Close Assessment</span>
            </button>
          </div>

          {/* MAIN FULL-SCREEN CONTENT AREA */}
          <div className="flex-1 max-w-5xl mx-auto w-full py-2">

            {/* MODE 1: CHOICE SCREEN (Forced Light Theme) */}
            {viewMode === 'choice' && (
              <div className="space-y-8 animate-in zoom-in-95 duration-200">
                <div className="text-center max-w-2xl mx-auto space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900" style={{ color: '#0f172a' }}>How would you like to set your current level?</h2>
                  <p className="text-sm text-slate-600">
                    Choose AI Quiz Detection for an automated evaluation or manually select your proficiency level.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  
                  {/* Card 1: AI Quiz Detection */}
                  <div className="rounded-2xl border-2 border-cyan-200 bg-white p-8 flex flex-col justify-between hover:border-cyan-400 hover:shadow-xl transition-all shadow-md space-y-6 relative overflow-hidden">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600 shadow-sm">
                          <Sparkles className="h-6 w-6" />
                        </div>
                        <span className="px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 text-xs font-extrabold border border-cyan-200">
                          AI RECOMMENDED
                        </span>
                      </div>

                      <h3 className="text-xl font-black text-slate-900" style={{ color: '#0f172a' }}>Detect My Level via AI Quiz</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        Don't know your exact level? Answer 6 dynamic Groq AI generated technical questions tailored to <span className="text-slate-900 font-bold">{selectedComp.name}</span> to automatically detect your proficiency score!
                      </p>
                    </div>

                    <button
                      onClick={handleStartAIQuiz}
                      className="w-full py-4 px-6 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-black text-sm shadow-md flex items-center justify-center gap-3 transition-all cursor-pointer"
                      style={{ backgroundColor: '#0891b2', color: '#ffffff' }}
                    >
                      <Sparkles className="h-5 w-5 text-white" />
                      <span>Start AI Quiz Assessment</span>
                    </button>
                  </div>

                  {/* Card 2: Manual Level Selection */}
                  <div className="rounded-2xl border-2 border-slate-200 bg-white p-8 flex flex-col justify-between hover:border-slate-400 transition-all shadow-md space-y-6">
                    <div className="space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700 shadow-sm">
                        <Edit3 className="h-6 w-6" />
                      </div>

                      <h3 className="text-xl font-black text-slate-900" style={{ color: '#0f172a' }}>I Know My Current Level</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        If you already know your proficiency tier (Level 1 to 5), manually pick your level to calculate your skill gap instantly.
                      </p>
                    </div>

                    <button
                      onClick={() => setViewMode('manual')}
                      className="w-full py-4 px-6 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-black text-sm shadow-md flex items-center justify-center gap-3 transition-all cursor-pointer"
                      style={{ backgroundColor: '#1e293b', color: '#ffffff' }}
                    >
                      <Edit3 className="h-5 w-5 text-white" />
                      <span>Manually Select Level (1 - 5)</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* MODE 2: MANUAL LEVEL SELECTION */}
            {viewMode === 'manual' && (
              <form onSubmit={handleSaveManualLevel} className="space-y-6 max-w-3xl mx-auto bg-white border border-slate-200 p-6 md:p-8 rounded-2xl shadow-lg">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <h3 className="text-lg font-black text-slate-900" style={{ color: '#0f172a' }}>Select Your Current Skill Level (1 - 5)</h3>
                  <button
                    type="button"
                    onClick={() => setViewMode('choice')}
                    className="text-xs text-cyan-700 hover:underline flex items-center gap-1 font-extrabold cursor-pointer"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Options</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {[
                    { level: 1, label: 'Level 1 - Basic Awareness', desc: 'Understands fundamental terms and principles; requires guidance.' },
                    { level: 2, label: 'Level 2 - Working Knowledge', desc: 'Can perform routine tasks independently with minimal assistance.' },
                    { level: 3, label: 'Level 3 - Operational Competent', desc: 'Fully independent execution of standard operational workflows.' },
                    { level: 4, label: 'Level 4 - Advanced Expert', desc: 'Deep technical mastery, complex troubleshooting, and optimization.' },
                    { level: 5, label: 'Level 5 - Master Specialist', desc: 'Institutional authority, strategic architecture, and mentoring.' }
                  ].map((item) => (
                    <label
                      key={item.level}
                      className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        newLevel === item.level
                          ? 'border-cyan-500 bg-cyan-50 text-slate-900 shadow-sm'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="manualLevelChoice"
                        checked={newLevel === item.level}
                        onChange={() => setNewLevel(item.level)}
                        className="mt-1 h-5 w-5 accent-cyan-600"
                      />
                      <div>
                        <span className="block text-sm font-black text-slate-900" style={{ color: '#0f172a' }}>{item.label}</span>
                        <span className="block text-xs text-slate-600 mt-1 leading-relaxed">{item.desc}</span>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-sm shadow-inner">
                  <span className="text-slate-600 font-semibold">Calculated Gap after save:</span>
                  <span className={`font-black text-base ${newLevel >= selectedComp.requiredLevel ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {newLevel >= selectedComp.requiredLevel
                      ? 'Target Met (0 Deficit)'
                      : `Skill Gap: -${selectedComp.requiredLevel - newLevel} Levels`}
                  </span>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setViewMode('choice')}
                    className="px-5 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs cursor-pointer border border-slate-300 shadow-sm"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={savingManual}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-extrabold text-xs shadow-md cursor-pointer"
                    style={{ backgroundColor: '#0891b2', color: '#ffffff' }}
                  >
                    {savingManual ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                    <span>Save Level & Calculate Gap</span>
                  </button>
                </div>
              </form>
            )}

            {/* MODE 3: AI QUIZ STEPPER (Forced Light Theme) */}
            {viewMode === 'quiz' && (
              <div className="space-y-6 max-w-4xl mx-auto">
                {loadingQuiz ? (
                  <div className="py-24 text-center space-y-4 bg-white border border-slate-200 rounded-2xl p-8 shadow-lg">
                    <Loader2 className="h-12 w-12 animate-spin text-cyan-600 mx-auto" />
                    <h3 className="text-xl font-black text-slate-900" style={{ color: '#0f172a' }}>Generating Groq AI Competency Quiz...</h3>
                    <p className="text-sm text-slate-600 max-w-md mx-auto">
                      Creating 6 dynamic domain-specific technical questions for <span className="text-cyan-700 font-bold">{selectedComp.name}</span>.
                    </p>
                  </div>
                ) : quizQuestions.length === 0 ? (
                  <div className="py-16 text-center bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                    <p className="text-sm text-rose-600 font-bold">Failed to load questions. Please check your network connection.</p>
                    <button
                      onClick={() => setViewMode('choice')}
                      className="mt-4 px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl cursor-pointer shadow-sm"
                      style={{ backgroundColor: '#1e293b', color: '#ffffff' }}
                    >
                      Back to Options
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    
                    {/* Stepper Progress Bar */}
                    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-2">
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <span className="text-slate-800 font-extrabold" style={{ color: '#1e293b' }}>
                          Question {currentQIndex + 1} of {quizQuestions.length}
                        </span>
                        <span className="text-cyan-700 font-black">
                          {Math.round(((currentQIndex + 1) / quizQuestions.length) * 100)}% Completed
                        </span>
                      </div>
                      <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-400 to-cyan-600 transition-all duration-300"
                          style={{ width: `${((currentQIndex + 1) / quizQuestions.length) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Question Card */}
                    <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-lg">
                      
                      <div className="flex items-start gap-4">
                        <span className="flex-shrink-0 px-3.5 py-1.5 rounded-xl bg-cyan-50 text-cyan-800 font-mono font-black text-lg border border-cyan-200 shadow-sm">
                          Q{currentQIndex + 1}
                        </span>
                        {/* FORCED DARK TEXT FOR QUESTION */}
                        <h3 className="text-lg sm:text-xl font-black leading-snug text-left flex-1 text-slate-900" style={{ color: '#0f172a' }}>
                          {quizQuestions[currentQIndex].questionText}
                        </h3>
                      </div>

                      {/* Selectable Options List */}
                      <div className="space-y-3 pt-2">
                        {quizQuestions[currentQIndex].options.map((opt, oIdx) => {
                          const isSelected = userAnswers[currentQIndex] === oIdx;
                          return (
                            <button
                              key={oIdx}
                              onClick={() => handleSelectOption(oIdx)}
                              className={`w-full text-left p-4 sm:p-5 rounded-xl border-2 text-sm sm:text-base font-semibold transition-all flex items-center justify-between cursor-pointer ${
                                isSelected
                                  ? 'border-cyan-500 bg-cyan-50 text-cyan-950 shadow-md ring-2 ring-cyan-500/20'
                                  : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black font-mono border ${
                                  isSelected ? 'border-cyan-600 bg-cyan-600 text-white' : 'border-slate-300 bg-slate-100 text-slate-700'
                                }`}>
                                  {String.fromCharCode(65 + oIdx)}
                                </span>
                                {/* FORCED DARK TEXT FOR OPTION */}
                                <span className="font-extrabold text-sm sm:text-base text-slate-900" style={{ color: '#0f172a' }}>{opt}</span>
                              </div>
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                isSelected ? 'border-cyan-600 bg-cyan-600' : 'border-slate-300 bg-slate-100'
                              }`}>
                                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Bottom Navigation Buttons */}
                    <div className="flex items-center justify-between pt-2">
                      <button
                        onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
                        disabled={currentQIndex === 0}
                        className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-extrabold text-xs sm:text-sm border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer shadow-sm"
                        style={{ color: '#1e293b' }}
                      >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Previous</span>
                      </button>

                      {currentQIndex < quizQuestions.length - 1 ? (
                        <button
                          onClick={() => setCurrentQIndex((prev) => prev + 1)}
                          disabled={userAnswers[currentQIndex] === -1}
                          className="px-7 py-3.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-black text-xs sm:text-sm shadow-md border border-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                          style={{ backgroundColor: '#0891b2', color: '#ffffff' }}
                        >
                          <span>Next Question</span>
                          <ArrowRight className="h-4 w-4 text-white" />
                        </button>
                      ) : (
                        <button
                          onClick={handleFinishQuiz}
                          disabled={userAnswers.some((ans) => ans === -1)}
                          className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm shadow-md border border-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                          style={{ backgroundColor: '#059669', color: '#ffffff' }}
                        >
                          <CheckCircle2 className="h-5 w-5 text-white" />
                          <span>Submit & Evaluate Quiz</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* MODE 4: QUIZ RESULT SCREEN */}
            {viewMode === 'quiz-result' && (
              <div className="space-y-8 max-w-3xl mx-auto animate-in zoom-in-95 duration-200">
                
                {/* Result Header Banner */}
                <div className="rounded-2xl bg-white border-2 border-cyan-300 p-8 text-center space-y-5 shadow-lg">
                  <div className="w-20 h-20 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600 mx-auto shadow-sm">
                    <Award className="h-10 w-10 text-cyan-600" />
                  </div>

                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-cyan-800 bg-cyan-50 px-3 py-1 rounded-full border border-cyan-200">
                      Groq AI Assessment Complete
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3" style={{ color: '#0f172a' }}>
                      Detected Level: Level {detectedLevel}
                    </h2>
                    <p className="text-sm text-slate-600 mt-2 font-semibold">
                      Quiz Score: <span className="text-cyan-700 font-extrabold text-base">{quizScore}%</span> ({quizQuestions.filter((q, i) => userAnswers[i] === q.correctOptionIndex).length}/{quizQuestions.length} Correct)
                    </p>
                  </div>

                  {/* Level Status Box */}
                  <div className="max-w-md mx-auto grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm shadow-inner">
                    <div>
                      <span className="block text-[11px] text-slate-500 uppercase font-extrabold">Detected Level</span>
                      <span className="text-base font-black text-cyan-700">Level {detectedLevel}</span>
                    </div>
                    <div className="border-l border-slate-200">
                      <span className="block text-[11px] text-slate-500 uppercase font-extrabold">Admin Target</span>
                      <span className="text-base font-black text-slate-900" style={{ color: '#0f172a' }}>Level {selectedComp.requiredLevel}</span>
                    </div>
                  </div>

                  {detectedLevel >= selectedComp.requiredLevel ? (
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-sm">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Congratulations! Target Level Met (0 Deficit)</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold shadow-sm">
                      <HelpCircle className="h-4 w-4" />
                      <span>Skill Gap Identified: -{selectedComp.requiredLevel - detectedLevel} Level Deficit</span>
                    </div>
                  )}
                </div>

                {/* Answers Breakdown */}
                <div className="space-y-3 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                  <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Question Breakdown</h4>
                  <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                    {quizQuestions.map((q, idx) => {
                      const isCorrect = userAnswers[idx] === q.correctOptionIndex;
                      return (
                        <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5 shadow-sm">
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-bold text-slate-900 text-sm" style={{ color: '#0f172a' }}>
                              {idx + 1}. {q.questionText}
                            </span>
                            {isCorrect ? (
                              <span className="shrink-0 flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md border border-emerald-200">
                                <CheckCircle2 className="h-3.5 w-3.5" /> Correct
                              </span>
                            ) : (
                              <span className="shrink-0 flex items-center gap-1 text-[11px] font-bold text-rose-800 bg-rose-100 px-2.5 py-0.5 rounded-md border border-rose-200">
                                <XCircle className="h-3.5 w-3.5" /> Incorrect
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed pt-1">
                            <span className="text-slate-800 font-bold">Explanation:</span> {q.explanation}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Navigation Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-4 border-t border-slate-200">
                  <button
                    onClick={() => setSelectedComp(null)}
                    className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold border border-slate-300 shadow-sm cursor-pointer"
                  >
                    Close & Stay Here
                  </button>

                  <button
                    onClick={() => {
                      setSelectedComp(null);
                      setActiveTab('skill-gap');
                    }}
                    className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-black border border-slate-800 shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                    style={{ backgroundColor: '#1e293b', color: '#ffffff' }}
                  >
                    <Compass className="h-4 w-4" style={{ color: '#ffffff' }} />
                    <span style={{ color: '#ffffff' }}>View Skill Gap Analysis</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedComp(null);
                      setActiveTab('dashboard');
                    }}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-black shadow-md border border-cyan-600 flex items-center justify-center gap-2 cursor-pointer"
                    style={{ backgroundColor: '#0891b2', color: '#ffffff' }}
                  >
                    <LayoutDashboard className="h-4 w-4 text-white" />
                    <span>Back to Dashboard</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};


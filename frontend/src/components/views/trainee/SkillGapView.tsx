import React, { useState, useEffect } from 'react';
import { Badge } from '../../common/Badge';
import { useApp } from '../../../context/AppContext';
import { BrainCircuit, BookOpen, FileText, ArrowRight, Sparkles, CheckCircle2, Loader2, Navigation, Download, ArrowLeft } from 'lucide-react';
import { SkillGapItem } from '../../../types';
import { traineeService } from '../../../services/api/traineeService';
import { competencyService } from '../../../services/api/competencyService';
import ReactMarkdown from 'react-markdown';

export const SkillGapView: React.FC = () => {
  const { setActiveTab, showToast } = useApp();
  const [skillGaps, setSkillGaps] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [enrollingId, setEnrollingId] = useState<string | null>(null);
  const [aiPathwayData, setAiPathwayData] = useState<{ pathway: string, courseId: string } | null>(null);
  const [showAiModal, setShowAiModal] = useState<boolean>(false);

  const loadGaps = async () => {
    try {
      setLoading(true);
      const data = await traineeService.getSkillGaps();
      setSkillGaps(data || []);
    } catch (err) {
      console.error('Failed to load skill gaps:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGaps();
  }, []);

  const handleEnrollPathway = async (gap: any) => {
    setEnrollingId(gap.id);
    try {
      // Call AI generation route
      const response = await competencyService.generateLearningPathway(gap.competencyName);
      if (response && response.pathway) {
        setAiPathwayData({
          pathway: response.pathway,
          courseId: response.recommendedCourse?._id
        });
        setShowAiModal(true);
        showToast('AI Pathway successfully generated!');
      } else {
        throw new Error('No pathway returned from server.');
      }
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to generate pathway.');
      // Fallback
      setActiveTab('courses');
    } finally {
      setEnrollingId(null);
    }
  };

  const navigateToCourse = () => {
    if (aiPathwayData?.courseId) {
      setShowAiModal(false);
      setActiveTab('courses');
      // Dispatch custom event to auto-open course detail modal in Catalog View
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('openCourseModal', { detail: aiPathwayData.courseId }));
      }, 300);
      showToast('Navigated to Course Catalog. Opening your recommended course...');
    }
  };

  const downloadPathway = () => {
    if (!aiPathwayData?.pathway) return;
    const blob = new Blob([aiPathwayData.pathway], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'AI_Learning_Pathway.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Pathway downloaded successfully!');
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
        <span className="ml-3 text-sm text-slate-500">Analyzing Competency Gaps...</span>
      </div>
    );
  }

  // --- FULL PAGE AI PATHWAY VIEW ---
  if (showAiModal && aiPathwayData) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 min-h-[70vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-8 py-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Your AI-Powered Learning Pathway</h2>
            <p className="text-sm text-slate-500 mt-1">Based on your specific skill gap and IMD operational requirements.</p>
          </div>
          <button
            onClick={() => setShowAiModal(false)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Skill Gaps</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <div className="text-slate-900 space-y-6 [&_h1]:text-3xl [&_h1]:font-black [&_h1]:text-slate-900 [&_h1]:mb-6 [&_h1]:pb-2 [&_h1]:border-b [&_h1]:border-slate-200 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-indigo-700 [&_h2]:mt-8 [&_h2]:mb-4 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-cyan-700 [&_h3]:mt-6 [&_h3]:mb-3 [&_p]:text-slate-700 [&_p]:leading-relaxed [&_p]:text-base [&_ul]:list-disc [&_ul]:list-outside [&_ul]:space-y-2 [&_ul]:text-slate-700 [&_ul]:ml-6 [&_ul]:mb-6 [&_li]:pl-1 [&_strong]:text-slate-900 [&_strong]:font-bold [&_em]:text-slate-600">
              <ReactMarkdown>
                {aiPathwayData.pathway}
              </ReactMarkdown>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-200 px-8 py-5 flex justify-end gap-4 bg-slate-50 rounded-b-xl">
          <button
            onClick={downloadPathway}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20 transition-all"
          >
            <Download className="h-4 w-4" />
            <span>Download Text</span>
          </button>
          <button
            onClick={navigateToCourse}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 transition-all"
          >
            <span>Navigate to Course</span>
            <Navigation className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }
  // ---------------------------------

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-cyan-400" />
            <span>Skill Gap Analysis & Learning Recommendations</span>
          </h2>
          <p className="text-xs text-slate-400">Personalized gap diagnostics based on your self-assessed level vs Admin course required level.</p>
        </div>
      </div>

      {/* Gaps List */}
      {skillGaps.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/40 p-12 text-center">
          <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-400 mb-3" />
          <h3 className="text-base font-bold text-white">No Skill Deficits Identified</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            You currently meet or exceed all required competency levels for active courses. Go to the Competencies tab to assess or update your skill levels.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {skillGaps.map((gap) => (
            <div
              key={gap.id}
              className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant={gap.priority === 'High' ? 'rose' : 'amber'}>
                    Priority: {gap.priority}
                  </Badge>
                  <span className="text-xs text-slate-400">Department: {gap.department}</span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">{gap.competencyName}</h3>
                  <div className="mt-1 flex items-center gap-4 text-xs text-slate-300 font-mono">
                    <span>Current: {gap.currentLevel > 0 ? `Level ${gap.currentLevel}` : 'Not Set (L0)'}</span>
                    <span>•</span>
                    <span>Required: Level {gap.requiredLevel}</span>
                    <span>•</span>
                    <span className="text-rose-400 font-bold">Deficit Gap: -{gap.gapScore} Levels</span>
                  </div>
                </div>

                {/* Recommended Courses Badges */}
                <div>
                  <span className="block text-[11px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                    Recommended Targeted Courses
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {gap.recommendedCourses && gap.recommendedCourses.length > 0 ? (
                      gap.recommendedCourses.map((crs: string, i: number) => (
                        <span
                          key={i}
                          onClick={() => {
                            setActiveTab('courses');
                            showToast(`Filtered recommendations for ${crs}`);
                          }}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 text-xs text-cyan-300 hover:bg-cyan-500 hover:text-white cursor-pointer transition-all"
                        >
                          <BookOpen className="h-3.5 w-3.5" />
                          <span>{crs}</span>
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500 italic">No matching course created by Admin yet.</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Box */}
              <div className="flex flex-col items-start lg:items-end justify-between border-t lg:border-t-0 lg:border-l border-slate-800 pt-4 lg:pt-0 lg:pl-6 gap-3">
                <div className="text-left lg:text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Trainee Cohort Gap</span>
                  <p className="text-xs font-bold text-white">Target Level Gap: -{gap.gapScore}</p>
                </div>

                <button
                  onClick={() => handleEnrollPathway(gap)}
                  disabled={enrollingId === gap.id}
                  className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500 shadow-md shadow-indigo-500/20 transition-all disabled:opacity-50"
                >
                  {enrollingId === gap.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  <span>{enrollingId === gap.id ? 'Generating AI Pathway...' : 'Enroll in Pathway'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

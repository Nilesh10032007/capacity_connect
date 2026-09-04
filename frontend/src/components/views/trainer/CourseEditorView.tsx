import React, { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { useAuth } from '../../../context/AuthContext';
import { courseService } from '../../../services/api/courseService';
import { PlusCircle, Save, BookOpen, Video, FileText, Trash2, X } from 'lucide-react';
import { Course } from '../../../types';

interface CourseEditorViewProps {
  initialData?: Course | null;
  onClose?: () => void;
}

export const CourseEditorView: React.FC<CourseEditorViewProps> = ({ initialData, onClose }) => {
  const { user } = useAuth();
  const { setActiveTab, showToast } = useApp();

  const [title, setTitle] = useState(initialData?.title || '');
  const [code, setCode] = useState(initialData?.code || 'MET-');
  const [subject, setSubject] = useState(initialData?.subject || 'Radar Meteorology');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'>(initialData?.difficulty || 'Advanced');
  const [duration, setDuration] = useState(initialData?.duration || '6 Weeks (36 hrs)');
  const [description, setDescription] = useState(initialData?.description || '');
  const [competencies, setCompetencies] = useState(initialData?.competenciesCovered?.join(', ') || 'Radar Meteorology & Doppler Interpretation');
  const [prerequisites, setPrerequisites] = useState(initialData?.prerequisites?.join(', ') || 'Atmospheric Dynamics 101');
  const [thumbnailUrl, setThumbnailUrl] = useState(initialData?.thumbnail || '');

  const [modules, setModules] = useState<any[]>(initialData?.modules || []);
  const [resources, setResources] = useState<any[]>([]);

  useEffect(() => {
    // If editing, fetch existing resources for this course
    if (initialData?.id) {
      courseService.getResources(initialData.id).then(res => setResources(res || []));
    }
  }, [initialData]);

  const handleAddModule = () => {
    setModules([...modules, { title: '', description: '', contentUrl: '', contentType: 'video' }]);
  };

  const handleRemoveModule = (index: number) => {
    const newModules = [...modules];
    newModules.splice(index, 1);
    setModules(newModules);
  };

  const handleModuleChange = (index: number, field: string, value: string) => {
    const newModules = [...modules];
    newModules[index][field] = value;
    setModules(newModules);
  };

  const handleAddResource = () => {
    setResources([...resources, { title: '', type: 'pdf', fileUrl: '', fileSize: '1.2 MB' }]);
  };

  const handleRemoveResource = (index: number) => {
    const newResources = [...resources];
    newResources.splice(index, 1);
    setResources(newResources);
  };

  const handleResourceChange = (index: number, field: string, value: string) => {
    const newResources = [...resources];
    newResources[index][field] = value;
    setResources(newResources);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        code,
        title,
        subject,
        description,
        difficulty,
        duration,
        trainerId: user?.id,
        trainerName: user?.name,
        competenciesCovered: competencies.split(',').map((c) => c.trim()),
        prerequisites: prerequisites.split(',').map((p) => p.trim()),
        thumbnailUrl: thumbnailUrl || 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=600&auto=format&fit=crop&q=80',
        modules,
        resources
      };

      if (initialData?.id) {
        await courseService.updateCourse(initialData.id, payload);
        showToast('Course updated successfully!');
      } else {
        await courseService.createCourse(payload);
        showToast('Course created successfully!');
      }

      if (onClose) {
        onClose();
      } else {
        setActiveTab('my-courses');
      }
    } catch (error) {
      console.error(error);
      showToast('Failed to save course');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200  pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800  flex items-center gap-2">
            {initialData ? <BookOpen className="h-5 w-5 text-emerald-500" /> : <PlusCircle className="h-5 w-5 text-emerald-500" />}
            <span>{initialData ? `Edit Course: ${initialData.code}` : 'Create Detailed Course'}</span>
          </h2>
          <p className="text-xs text-slate-500 ">Manage comprehensive course details, modules, and resources.</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 :bg-slate-800 text-slate-500 transition-colors">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information Section */}
        <div className="rounded-xl border border-slate-200  bg-white  p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800  mb-4 border-b border-slate-100  pb-2">1. Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600  mb-1">Course Code</label>
              <input type="text" required value={code} onChange={(e) => setCode(e.target.value)} className="w-full rounded-lg border border-slate-300  bg-slate-50  p-2.5 text-xs text-slate-800  focus:border-emerald-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600  mb-1">Course Title</label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-lg border border-slate-300  bg-slate-50  p-2.5 text-xs text-slate-800  focus:border-emerald-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600  mb-1">Subject Area</label>
              <select value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full rounded-lg border border-slate-300  bg-slate-50  p-2.5 text-xs text-slate-800  focus:border-emerald-500 focus:outline-none">
                <option value="Radar Meteorology">Radar Meteorology</option>
                <option value="Numerical Modeling">Numerical Modeling</option>
                <option value="Remote Sensing">Remote Sensing</option>
                <option value="Data Science & AI">Data Science & AI</option>
                <option value="Instrumentation">Instrumentation</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600  mb-1">Thumbnail URL</label>
              <input type="text" value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} placeholder="https://images.unsplash.com/..." className="w-full rounded-lg border border-slate-300  bg-slate-50  p-2.5 text-xs text-slate-800  focus:border-emerald-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600  mb-1">Difficulty</label>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as any)} className="w-full rounded-lg border border-slate-300  bg-slate-50  p-2.5 text-xs text-slate-800  focus:border-emerald-500 focus:outline-none">
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600  mb-1">Duration</label>
              <input type="text" required value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full rounded-lg border border-slate-300  bg-slate-50  p-2.5 text-xs text-slate-800  focus:border-emerald-500 focus:outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-600  mb-1">Description</label>
              <textarea rows={3} required value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-lg border border-slate-300  bg-slate-50  p-2.5 text-xs text-slate-800  focus:border-emerald-500 focus:outline-none"></textarea>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-600  mb-1">Competencies Covered (comma separated)</label>
              <input type="text" required value={competencies} onChange={(e) => setCompetencies(e.target.value)} className="w-full rounded-lg border border-slate-300  bg-slate-50  p-2.5 text-xs text-slate-800  focus:border-emerald-500 focus:outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-600  mb-1">Prerequisites (comma separated)</label>
              <input type="text" required value={prerequisites} onChange={(e) => setPrerequisites(e.target.value)} className="w-full rounded-lg border border-slate-300  bg-slate-50  p-2.5 text-xs text-slate-800  focus:border-emerald-500 focus:outline-none" />
            </div>
          </div>
        </div>

        {/* Modules / Lectures Section */}
        <div className="rounded-xl border border-slate-200  bg-white  p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100  pb-2">
            <h3 className="text-sm font-bold text-slate-800  flex items-center gap-2">
              <Video className="h-4 w-4 text-emerald-500" />
              2. Modules & Video Lectures
            </h3>
            <button type="button" onClick={handleAddModule} className="flex items-center gap-1 text-xs font-bold text-emerald-600  hover:underline">
              <PlusCircle className="h-4 w-4" /> Add Module
            </button>
          </div>
          
          {modules.length === 0 && (
            <div className="text-center p-6 text-xs text-slate-500  border border-dashed border-slate-300  rounded-lg">
              No modules added yet. Click "Add Module" to start adding lectures.
            </div>
          )}

          <div className="space-y-4">
            {modules.map((mod, index) => (
              <div key={index} className="p-4 rounded-lg bg-slate-50  border border-slate-200  relative">
                <button type="button" onClick={() => handleRemoveModule(index)} className="absolute top-3 right-3 text-red-500 hover:bg-red-50 :bg-red-500/10 p-1.5 rounded-full transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
                <h4 className="text-xs font-bold text-slate-700  mb-3">Module {index + 1}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Module Title</label>
                    <input type="text" required value={mod.title} onChange={(e) => handleModuleChange(index, 'title', e.target.value)} placeholder="e.g. Introduction to Doppler Radar" className="w-full rounded border border-slate-300  bg-white  p-2 text-xs text-slate-800  focus:border-emerald-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Video URL (YouTube/Vimeo)</label>
                    <input type="url" required value={mod.contentUrl} onChange={(e) => handleModuleChange(index, 'contentUrl', e.target.value)} placeholder="https://youtube.com/..." className="w-full rounded border border-slate-300  bg-white  p-2 text-xs text-slate-800  focus:border-emerald-500 focus:outline-none" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Written Notes / Description</label>
                    <textarea rows={2} required value={mod.description} onChange={(e) => handleModuleChange(index, 'description', e.target.value)} placeholder="Module description or lecture notes..." className="w-full rounded border border-slate-300  bg-white  p-2 text-xs text-slate-800  focus:border-emerald-500 focus:outline-none"></textarea>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resources Section */}
        <div className="rounded-xl border border-slate-200  bg-white  p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100  pb-2">
            <h3 className="text-sm font-bold text-slate-800  flex items-center gap-2">
              <FileText className="h-4 w-4 text-emerald-500" />
              3. Course Resources & PDFs
            </h3>
            <button type="button" onClick={handleAddResource} className="flex items-center gap-1 text-xs font-bold text-emerald-600  hover:underline">
              <PlusCircle className="h-4 w-4" /> Add Resource
            </button>
          </div>

          {resources.length === 0 && (
            <div className="text-center p-6 text-xs text-slate-500  border border-dashed border-slate-300  rounded-lg">
              No resources added yet. Add supplementary notes or datasets.
            </div>
          )}

          <div className="space-y-4">
            {resources.map((res, index) => (
              <div key={index} className="flex flex-col sm:flex-row items-center gap-3 p-3 rounded-lg bg-slate-50  border border-slate-200 ">
                <div className="flex-1 w-full">
                  <input type="text" required value={res.title} onChange={(e) => handleResourceChange(index, 'title', e.target.value)} placeholder="Resource Title (e.g. Chapter 1 PDF)" className="w-full rounded border border-slate-300  bg-white  p-2 text-xs text-slate-800  focus:border-emerald-500 focus:outline-none" />
                </div>
                <div className="flex-1 w-full">
                  <input type="url" required value={res.fileUrl} onChange={(e) => handleResourceChange(index, 'fileUrl', e.target.value)} placeholder="Resource Link / URL" className="w-full rounded border border-slate-300  bg-white  p-2 text-xs text-slate-800  focus:border-emerald-500 focus:outline-none" />
                </div>
                <div className="w-full sm:w-32">
                  <select value={res.type} onChange={(e) => handleResourceChange(index, 'type', e.target.value)} className="w-full rounded border border-slate-300  bg-white  p-2 text-xs text-slate-800  focus:border-emerald-500 focus:outline-none">
                    <option value="pdf">PDF</option>
                    <option value="dataset">Dataset</option>
                    <option value="code">Code</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <button type="button" onClick={() => handleRemoveResource(index)} className="p-2 text-red-500 hover:bg-red-50 :bg-red-500/10 rounded-lg transition-colors shrink-0">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 ">
          <button type="button" onClick={onClose ? onClose : () => setActiveTab('my-courses')} className="px-5 py-2.5 rounded-xl border border-slate-300  bg-white  text-slate-700  text-sm font-semibold hover:bg-slate-50 :bg-slate-800 transition-all">
            Cancel
          </button>
          <button type="submit" className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-500 transition-all">
            <Save className="h-4 w-4" />
            <span>{initialData ? 'Save Changes' : 'Create Course'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

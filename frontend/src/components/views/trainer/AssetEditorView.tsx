import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { courseService } from '../../../services/api/courseService';
import { FileText, Video, FileCode, Presentation, Database, Link as LinkIcon, Save, X, Upload } from 'lucide-react';

interface AssetEditorViewProps {
  onClose: () => void;
  onSuccess: (newAsset: any) => void;
}

export const AssetEditorView: React.FC<AssetEditorViewProps> = ({ onClose, onSuccess }) => {
  const { showToast } = useApp();
  
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'pdf' | 'video' | 'presentation' | 'code' | 'script' | 'text' | 'dataset' | 'other'>('pdf');
  const [category, setCategory] = useState('Manuals');
  
  const [fileUrl, setFileUrl] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const payload = {
        title,
        type,
        category,
        fileUrl: ['pdf', 'video', 'dataset', 'presentation', 'other'].includes(type) ? fileUrl : undefined,
        content: ['code', 'script', 'text'].includes(type) ? content : undefined,
      };

      // Ensure courseService has an uploadTrainerAsset or we can just hit /resources/upload
      const newAsset = await fetch('http://localhost:5000/api/resources/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      }).then(res => res.json());

      if (newAsset.success) {
        showToast('Asset uploaded successfully!');
        onSuccess(newAsset.data);
      } else {
        showToast(newAsset.message || 'Failed to upload asset');
      }
    } catch (err) {
      console.error(err);
      showToast('Error uploading asset');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderDynamicInput = () => {
    if (['code', 'script'].includes(type)) {
      return (
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Code / Script Content</label>
          <div className="rounded-lg border border-slate-300 overflow-hidden">
            <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex items-center gap-2">
              <FileCode className="h-4 w-4 text-emerald-400" />
              <span className="text-xs font-mono text-slate-300">main.{type === 'script' ? 'sh' : 'py'}</span>
            </div>
            <textarea 
              rows={12} 
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="# Paste your code snippet or operational script here..."
              className="w-full bg-slate-900 text-emerald-400 font-mono text-sm p-4 focus:outline-none"
              spellCheck="false"
            />
          </div>
        </div>
      );
    }

    if (type === 'text') {
      return (
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Document Text</label>
          <textarea 
            rows={10} 
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your operational notes or document content here..."
            className="w-full rounded-lg border border-slate-300 bg-white p-4 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none shadow-inner"
          />
        </div>
      );
    }

    // Default for PDF, Video, Dataset, etc.
    return (
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-slate-700">File URL / Link</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <LinkIcon className="h-4 w-4 text-slate-400" />
          </div>
          <input 
            type="url" 
            required
            value={fileUrl}
            onChange={(e) => setFileUrl(e.target.value)}
            placeholder="https://example.com/file.pdf" 
            className="w-full rounded-lg border border-slate-300 bg-white pl-10 p-2.5 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none shadow-sm" 
          />
        </div>
        <p className="text-xs text-slate-500 mt-1">Provide a direct link to the file. (File uploads can be supported by switching to FormData)</p>
      </div>
    );
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-4xl mx-auto pb-12">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Upload className="h-6 w-6 text-emerald-600" />
              <span>Upload New Asset</span>
            </h2>
            <p className="text-sm text-slate-500 mt-1">Add operational manuals, scripts, and video lectures to the library.</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Asset Title</label>
                <input 
                  type="text" 
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. DWR Calibration Script 2026" 
                  className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none shadow-sm" 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Asset Type</label>
                <select 
                  value={type} 
                  onChange={(e) => setType(e.target.value as any)} 
                  className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none shadow-sm"
                >
                  <option value="pdf">PDF Document</option>
                  <option value="text">Text Document</option>
                  <option value="code">Code Snippet</option>
                  <option value="script">Operational Script</option>
                  <option value="video">Video Lecture</option>
                  <option value="presentation">Presentation</option>
                  <option value="dataset">Dataset (NetCDF/CSV)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)} 
                  className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none shadow-sm"
                >
                  <option value="Manuals">Operational Manuals</option>
                  <option value="Scripts">Scripts & Code</option>
                  <option value="Datasets">Datasets</option>
                  <option value="Lectures">Video Lectures</option>
                  <option value="General">General Assets</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              {renderDynamicInput()}
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button 
              type="button" 
              onClick={onClose}
              className="px-6 py-3 rounded-lg font-bold text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-6 py-3 rounded-lg font-bold text-white bg-emerald-600 hover:bg-emerald-500 flex items-center gap-2 shadow-lg shadow-emerald-600/20 disabled:opacity-70 transition-all"
            >
              <Save className="h-5 w-5" />
              <span>{isSubmitting ? 'Uploading...' : 'Upload Asset'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

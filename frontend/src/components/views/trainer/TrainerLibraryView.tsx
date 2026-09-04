import React, { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { Badge } from '../../common/Badge';
import { FolderPlus, Upload, FileText, Video, Presentation, FileCode, Database, Download, FileTerminal, AlignLeft, Loader2, Trash2 } from 'lucide-react';
import { courseService } from '../../../services/api/courseService';
import { AssetEditorView } from './AssetEditorView';

export const TrainerLibraryView: React.FC = () => {
  const { showToast } = useApp();
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const res = await courseService.getResources();
      setResources(res || []);
    } catch (err) {
      console.error(err);
      showToast('Failed to load library resources');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;
    try {
      await courseService.deleteResource(id);
      showToast('Resource deleted successfully');
      setResources(resources.filter(r => (r._id || r.id) !== id));
    } catch (err) {
      console.error(err);
      showToast('Failed to delete resource');
    }
  };

  const typeIcons: Record<string, React.ReactNode> = {
    pdf: <FileText className="h-4 w-4 text-rose-500" />,
    video: <Video className="h-4 w-4 text-cyan-500" />,
    presentation: <Presentation className="h-4 w-4 text-amber-500" />,
    code: <FileCode className="h-4 w-4 text-emerald-500" />,
    script: <FileTerminal className="h-4 w-4 text-indigo-500" />,
    text: <AlignLeft className="h-4 w-4 text-slate-500" />,
    dataset: <Database className="h-4 w-4 text-purple-500" />,
    other: <FileText className="h-4 w-4 text-slate-400" />
  };

  if (isUploading) {
    return (
      <AssetEditorView 
        onClose={() => setIsUploading(false)} 
        onSuccess={(newAsset) => {
          setResources([newAsset, ...resources]);
          setIsUploading(false);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FolderPlus className="h-5 w-5 text-emerald-600" />
            <span>Trainer Content Library & Asset Repository</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">Upload and manage operational manuals, lecture videos, scripts, and code snippets.</p>
        </div>

        <button
          onClick={() => setIsUploading(true)}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 transition-all"
        >
          <Upload className="h-4 w-4" />
          <span>Upload New Asset</span>
        </button>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          <span className="ml-3 text-sm text-slate-500 font-semibold">Loading Library Assets...</span>
        </div>
      ) : resources.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
          <FolderPlus className="mx-auto h-12 w-12 text-slate-400 mb-4" />
          <h3 className="text-lg font-bold text-slate-700">Library is Empty</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            You haven't uploaded any operational assets yet. Click "Upload New Asset" to start building your repository.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((res) => (
            <div key={res._id || res.id} className="rounded-xl border border-slate-200 bg-white p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow group">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <Badge variant="cyan" icon={typeIcons[res.type] || typeIcons['other']}>
                    {(res.type || 'UNKNOWN').toUpperCase()}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 font-mono font-semibold bg-slate-100 px-2 py-1 rounded">
                      {new Date(res.uploadDate || res.createdAt).toLocaleDateString()}
                    </span>
                    <button 
                      onClick={() => handleDelete(res._id || res.id)}
                      className="text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-800 leading-snug mb-1">{res.title}</h3>
                <p className="text-xs font-semibold text-emerald-600">{res.category}</p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-slate-500 bg-slate-50 px-2 py-1 rounded">{res.fileSize || 'N/A'}</span>
                
                {['code', 'script', 'text'].includes(res.type) ? (
                  <button
                    onClick={() => showToast(`Viewing Content for ${res.title}`)}
                    className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-500 hover:underline font-bold"
                  >
                    <FileText className="h-4 w-4" />
                    <span>View Content</span>
                  </button>
                ) : (
                  <a
                    href={res.fileUrl || res.downloadUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-500 hover:underline font-bold"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

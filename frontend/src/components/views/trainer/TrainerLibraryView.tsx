import React, { useState } from 'react';
import { MOCK_RESOURCES } from '../../../services/mockData';
import { useApp } from '../../../context/AppContext';
import { Badge } from '../../common/Badge';
import { Modal } from '../../common/Modal';
import { FolderPlus, Upload, FileText, Video, Presentation, FileCode, Database, Download } from 'lucide-react';
import { courseService } from '../../../services/api/courseService';

export const TrainerLibraryView: React.FC = () => {
  const { showToast } = useApp();
  const [resources, setResources] = useState(MOCK_RESOURCES);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'pdf' | 'video' | 'presentation' | 'code' | 'dataset'>('pdf');
  const [category, setCategory] = useState('Manuals');

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    const newRes = await courseService.uploadResource({
      title: title || 'Operational_Radar_Dataset_2026.nc',
      type,
      fileSize: '18.4 MB',
      uploadedBy: 'Prof. V. K. Murthy',
      downloadUrl: '#',
      category
    });
    setResources((prev) => [newRes, ...prev]);
    setShowUploadModal(false);
    showToast(`Uploaded ${newRes.title} to Trainer Resource Repository`);
  };

  const typeIcons = {
    pdf: <FileText className="h-4 w-4 text-rose-400" />,
    video: <Video className="h-4 w-4 text-cyan-400" />,
    presentation: <Presentation className="h-4 w-4 text-amber-400" />,
    code: <FileCode className="h-4 w-4 text-emerald-400" />,
    dataset: <Database className="h-4 w-4 text-purple-400" />
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FolderPlus className="h-5 w-5 text-emerald-400" />
            <span>Trainer Content Library & Asset Repository</span>
          </h2>
          <p className="text-xs text-slate-400">Upload and manage operational manuals, lecture videos, NetCDF datasets, and code notebooks.</p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-500 transition-all"
        >
          <Upload className="h-4 w-4" />
          <span>Upload New Asset</span>
        </button>
      </div>

      {/* Resource Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {resources.map((res) => (
          <div key={res.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <Badge variant="cyan" icon={typeIcons[res.type]}>
                  {res.type.toUpperCase()}
                </Badge>
                <span className="text-[10px] text-slate-500 font-mono">{res.uploadDate}</span>
              </div>

              <h3 className="text-sm font-bold text-white leading-snug">{res.title}</h3>
              <p className="text-xs text-slate-400 mt-1">Uploaded by: {res.uploadedBy}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">{res.fileSize}</span>
              <button
                onClick={() => showToast(`Downloading ${res.title}`)}
                className="flex items-center gap-1 text-xs text-cyan-400 hover:underline font-semibold"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Asset Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Upload Operational Learning Asset"
        subtitle="Supported formats: PDF, MP4 Video, PPTX, IPYNB, NetCDF"
      >
        <form onSubmit={handleUpload} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Asset Title / File Name</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded border border-slate-800 bg-slate-950 p-2.5 text-white"
              placeholder="e.g. WRF_Parameterization_Guide_2026.pdf"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Asset Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full rounded border border-slate-800 bg-slate-950 p-2.5 text-white"
              >
                <option value="pdf">PDF Document</option>
                <option value="video">Video Lecture</option>
                <option value="presentation">Presentation (PPTX)</option>
                <option value="code">Code Notebook (IPYNB/Python)</option>
                <option value="dataset">NetCDF/GRIB Dataset</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded border border-slate-800 bg-slate-950 p-2.5 text-white"
              >
                <option value="Manuals">Manuals</option>
                <option value="Guides">Guides</option>
                <option value="Code Scripts">Code Scripts</option>
                <option value="Datasets">Datasets</option>
              </select>
            </div>
          </div>

          {/* Drag and Drop Zone Dummy UI */}
          <div className="border-2 border-dashed border-slate-800 hover:border-emerald-500/50 rounded-xl p-6 text-center bg-slate-950/60 cursor-pointer">
            <Upload className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
            <p className="font-semibold text-slate-200">Drag & drop files here, or browse from computer</p>
            <span className="text-[10px] text-slate-500">Maximum file size: 500 MB</span>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setShowUploadModal(false)} className="px-3 py-1.5 rounded bg-slate-800 text-slate-400">
              Cancel
            </button>
            <button type="submit" className="px-4 py-1.5 rounded bg-emerald-600 font-bold text-white">
              Confirm Upload
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

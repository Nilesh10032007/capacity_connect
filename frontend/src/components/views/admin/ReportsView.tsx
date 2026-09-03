import React from 'react';
import { useApp } from '../../../context/AppContext';
import { FileSpreadsheet, Download, FileText, BarChart } from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { showToast } = useApp();

  const reports = [
    { title: 'National Meteorological Capacity Building Comprehensive Report 2026', type: 'Training Report', size: '12.4 MB' },
    { title: 'IMD / MoES Organizational Competency & Skill Gap Audit Matrix', type: 'Competency Report', size: '8.2 MB' },
    { title: 'Doppler Radar & NWP Course Performance & Completion Metrics', type: 'Course Performance Report', size: '5.6 MB' },
    { title: 'Master Trainer Performance Evaluation & Feedback Summary', type: 'Trainer Performance Report', size: '3.1 MB' },
    { title: 'WMO Standard Certified Officers Registry Report Q3', type: 'Certification Report', size: '4.8 MB' }
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5 text-purple-400" />
          <span>Institutional Capacity Reporting & Export Center</span>
        </h2>
        <p className="text-xs text-slate-400">Generate, view, and export official PDF/Excel reports for executive council review.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {reports.map((r, i) => (
          <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider block mb-1">{r.type}</span>
              <h3 className="text-sm font-bold text-white leading-snug">{r.title}</h3>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">{r.size}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => showToast(`Generated PDF for ${r.type}`)}
                  className="flex items-center gap-1 text-xs text-purple-400 hover:underline font-semibold"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>PDF</span>
                </button>
                <button
                  onClick={() => showToast(`Generated CSV for ${r.type}`)}
                  className="flex items-center gap-1 text-xs text-cyan-400 hover:underline font-semibold"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>CSV</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

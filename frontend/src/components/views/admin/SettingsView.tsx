import React from 'react';
import { useApp } from '../../../context/AppContext';
import { Settings, Shield, Bell, Database } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { showToast } = useApp();

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Settings className="h-5 w-5 text-purple-400" />
          <span>System & Competency Framework Configuration</span>
        </h2>
        <p className="text-xs text-slate-400">Institutional settings, WMO framework scales, and notification rules.</p>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 max-w-2xl">
        <h3 className="text-sm font-bold text-white">Competency Scale Thresholds</h3>
        <div className="space-y-3 text-xs">
          <div className="flex justify-between items-center p-3 rounded bg-slate-950 border border-slate-800">
            <span>Level 1 (Basic Operational Knowledge)</span>
            <span className="font-mono text-cyan-400">Score 0 - 30</span>
          </div>
          <div className="flex justify-between items-center p-3 rounded bg-slate-950 border border-slate-800">
            <span>Level 3 (Intermediate Applied Skills)</span>
            <span className="font-mono text-cyan-400">Score 50 - 75</span>
          </div>
          <div className="flex justify-between items-center p-3 rounded bg-slate-950 border border-slate-800">
            <span>Level 5 (Expert / Master Innovator)</span>
            <span className="font-mono text-cyan-400">Score 90 - 100</span>
          </div>
        </div>

        <button
          onClick={() => showToast('Institutional system settings updated')}
          className="mt-4 px-4 py-2 rounded-lg bg-purple-600 font-bold text-xs text-white"
        >
          Save Configuration
        </button>
      </div>
    </div>
  );
};

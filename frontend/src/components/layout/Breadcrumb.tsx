import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

export const Breadcrumb: React.FC = () => {
  const { role } = useAuth();
  const { activeTab } = useApp();

  const formattedTab = activeTab
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <nav className="flex items-center gap-2 text-xs text-slate-400 py-3 px-6 border-b border-slate-800/60 bg-slate-950/40">
      <div className="flex items-center gap-1.5 hover:text-slate-200 cursor-pointer">
        <Home className="h-3.5 w-3.5 text-cyan-400" />
        <span className="capitalize">{role} Portal</span>
      </div>
      <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
      <span className="font-semibold text-slate-200">{formattedTab}</span>
    </nav>
  );
};

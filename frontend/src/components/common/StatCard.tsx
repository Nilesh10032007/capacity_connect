import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  accentColor?: 'cyan' | 'blue' | 'emerald' | 'amber' | 'purple';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  change,
  changeType,
  icon,
  accentColor = 'cyan'
}) => {
  const accentGradients = {
    cyan: 'from-cyan-500/20 to-blue-600/10 border-cyan-500/30 text-cyan-400',
    blue: 'from-blue-500/20 to-indigo-600/10 border-blue-500/30 text-blue-400',
    emerald: 'from-emerald-500/20 to-teal-600/10 border-emerald-500/30 text-emerald-400',
    amber: 'from-amber-500/20 to-orange-600/10 border-amber-500/30 text-amber-400',
    purple: 'from-purple-500/20 to-pink-600/10 border-purple-500/30 text-purple-400'
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg backdrop-blur-sm transition-all hover:border-slate-700">
      <div className={`absolute top-0 right-0 h-24 w-24 rounded-full bg-gradient-to-br ${accentGradients[accentColor]} blur-2xl opacity-40`} />
      
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</span>
        <div className={`p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/50 ${accentGradients[accentColor].split(' ').pop()}`}>
          {icon}
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <div className="text-2xl lg:text-3xl font-bold tracking-tight text-white">{value}</div>
        {change && (
          <div
            className={`flex items-center text-xs font-semibold ${
              changeType === 'positive'
                ? 'text-emerald-400'
                : changeType === 'negative'
                ? 'text-rose-400'
                : 'text-slate-400'
            }`}
          >
            {changeType === 'positive' && <TrendingUp className="mr-1 h-3.5 w-3.5" />}
            {changeType === 'negative' && <TrendingDown className="mr-1 h-3.5 w-3.5" />}
            {changeType === 'neutral' && <Minus className="mr-1 h-3.5 w-3.5" />}
            {change}
          </div>
        )}
      </div>

      {subtitle && <p className="mt-1 text-xs text-slate-400 truncate">{subtitle}</p>}
    </div>
  );
};

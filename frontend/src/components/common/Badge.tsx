import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'blue' | 'emerald' | 'amber' | 'rose' | 'slate' | 'indigo' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'cyan', size = 'sm', icon }) => {
  const variantStyles = {
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    slate: 'bg-slate-700/30 text-slate-300 border-slate-700/50',
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-md border ${variantStyles[variant]} ${sizeStyles[size]}`}>
      {icon && <span className="w-3.5 h-3.5">{icon}</span>}
      {children}
    </span>
  );
};

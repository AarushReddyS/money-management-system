import React from 'react';

export const StatCard = ({ title, value, subtitle, icon: Icon, color = 'indigo', trend }) => {
  const colorMap = {
    indigo: {
      bg: 'bg-indigo-50 text-indigo-600',
      border: 'border-indigo-100',
      gradient: 'from-indigo-500/10 to-transparent'
    },
    emerald: {
      bg: 'bg-emerald-50 text-emerald-600',
      border: 'border-emerald-100',
      gradient: 'from-emerald-500/10 to-transparent'
    },
    rose: {
      bg: 'bg-rose-50 text-rose-600',
      border: 'border-rose-100',
      gradient: 'from-rose-500/10 to-transparent'
    },
    amber: {
      bg: 'bg-amber-50 text-amber-600',
      border: 'border-amber-100',
      gradient: 'from-amber-500/10 to-transparent'
    },
    blue: {
      bg: 'bg-blue-50 text-blue-600',
      border: 'border-blue-100',
      gradient: 'from-blue-500/10 to-transparent'
    },
    purple: {
      bg: 'bg-purple-50 text-purple-600',
      border: 'border-purple-100',
      gradient: 'from-purple-500/10 to-transparent'
    }
  };

  const scheme = colorMap[color] || colorMap.indigo;

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-slate-200/80 transition-all hover:shadow-md`}>
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${scheme.gradient} rounded-bl-full pointer-events-none`} />
      
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-500 tracking-wide">{title}</p>
        {Icon && (
          <div className={`p-3 rounded-xl ${scheme.bg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-4">
        <h4 className="text-2xl font-extrabold text-slate-900 tracking-tight">{value}</h4>
        {subtitle && (
          <p className="mt-1 text-xs text-slate-500 flex items-center gap-1">
            {trend && (
              <span className={`font-semibold ${trend > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {trend > 0 ? `+${trend}%` : `${trend}%`}
              </span>
            )}
            <span>{subtitle}</span>
          </p>
        )}
      </div>
    </div>
  );
};


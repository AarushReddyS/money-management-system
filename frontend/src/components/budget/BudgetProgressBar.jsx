import React from 'react';
import { useCurrency } from '../../context/CurrencyContext';

export const BudgetProgressBar = ({ totalBudget = 0, totalSpent = 0 }) => {
  const { format } = useCurrency();
  const percentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  const isOver = totalSpent > totalBudget && totalBudget > 0;
  const remaining = totalBudget - totalSpent;

  const getBarColor = () => {
    if (percentage > 100) return 'bg-rose-500';
    if (percentage >= 85) return 'bg-amber-500';
    return 'bg-indigo-600';
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Monthly Budget Usage</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black text-slate-900">{format(totalSpent)}</span>
            <span className="text-sm text-slate-400 font-semibold">of {format(totalBudget)}</span>
          </div>
        </div>

        <div className="text-left sm:text-right">
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
              isOver
                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                : percentage >= 85
                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
            }`}
          >
            {isOver ? `Over Budget by ${format(Math.abs(remaining))}` : `${format(remaining)} remaining`}
          </span>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            {percentage.toFixed(1)}% of total allocated
          </p>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 rounded-full ${getBarColor()}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
};


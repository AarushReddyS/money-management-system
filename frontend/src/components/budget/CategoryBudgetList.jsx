import React from 'react';
import { useCurrency } from '../../context/CurrencyContext';
import { EXPENSE_CATEGORIES } from '../../utils/constants';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export const CategoryBudgetList = ({ comparisons }) => {
  const { format } = useCurrency();

  if (!comparisons || comparisons.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 text-center text-slate-500 text-sm">
        No category allocations configured for this month.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {comparisons.map((item) => {
        const catMeta = EXPENSE_CATEGORIES.find((c) => c.value === item.category) || {
          label: item.category,
          bg: 'bg-slate-100 text-slate-800',
        };

        const pct = item.allocatedAmount > 0 ? (item.spentAmount / item.allocatedAmount) * 100 : 100;
        const isOver = item.isOverBudget;
        const barColor = isOver ? 'bg-rose-500' : pct >= 85 ? 'bg-amber-500' : 'bg-indigo-600';

        return (
          <div
            key={item.category}
            className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${catMeta.bg}`}>
                {catMeta.label}
              </span>
              <div className="flex items-center gap-1 text-xs font-bold">
                {isOver ? (
                  <span className="text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Over by {format(Math.abs(item.remainingAmount))}
                  </span>
                ) : (
                  <span className="text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {format(item.remainingAmount)} left
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-baseline justify-between text-xs text-slate-500 font-semibold">
              <span>
                Spent: <strong className="text-slate-900 font-bold">{format(item.spentAmount)}</strong>
              </span>
              <span>
                Budget: <strong className="text-slate-700">{format(item.allocatedAmount)}</strong>
              </span>
            </div>

            {/* Micro Progress Bar */}
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 rounded-full ${barColor}`}
                style={{ width: `${Math.min(pct, 100)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};


import React from 'react';
import { useCurrency } from '../../context/CurrencyContext';
import { EXPENSE_CATEGORIES } from '../../utils/constants';

export const ExpenseCategoryChart = ({ categories = [], title = 'Expense Breakdown' }) => {
  const { format } = useCurrency();

  if (!categories || categories.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm h-full flex flex-col items-center justify-center text-slate-400 text-sm">
        No expense category data available yet.
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between h-full">
      <div>
        <h3 className="text-base font-bold text-slate-900">{title}</h3>
        <p className="text-xs text-slate-500 mb-5">Distribution of spending across categories</p>

        <div className="space-y-4">
          {categories.slice(0, 6).map((item) => {
            const cat = EXPENSE_CATEGORIES.find((c) => c.value === item.category) || {
              label: item.category,
              color: '#6366f1',
            };

            return (
              <div key={item.category} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    {cat.label}
                  </span>
                  <span className="font-extrabold text-slate-900">
                    {format(item.amount)}{' '}
                    <span className="text-slate-400 font-normal">({item.percentage.toFixed(1)}%)</span>
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {categories.length > 6 && (
        <p className="text-[11px] text-slate-400 text-center mt-4">
          + {categories.length - 6} more smaller categories
        </p>
      )}
    </div>
  );
};


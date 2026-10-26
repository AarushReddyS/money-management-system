import React from 'react';
import { Link } from 'react-router-dom';
import { PieChart, ArrowRight, AlertCircle } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';

export const BudgetProgressWidget = ({
  monthlyBudget = 0,
  monthlyExpense = 0,
  percentageSpent = 0,
  isBudgetExceeded = false,
}) => {
  const { format } = useCurrency();
  const remaining = Number(monthlyBudget) - Number(monthlyExpense);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <PieChart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Current Month Budget</h3>
              <p className="text-xs text-slate-500">Target spending ceiling</p>
            </div>
          </div>
          <Link
            to="/budgets"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>Manage</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {Number(monthlyBudget) <= 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            <p>No budget set for this month yet.</p>
            <Link
              to="/budgets"
              className="mt-2 inline-block text-xs font-bold text-indigo-600 underline"
            >
              Set monthly budget
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-2xl font-black text-slate-900">{format(monthlyExpense)}</span>
                <span className="text-xs text-slate-400 ml-1 font-semibold">of {format(monthlyBudget)}</span>
              </div>
              <span
                className={`text-xs font-extrabold px-2.5 py-1 rounded-full ${
                  isBudgetExceeded
                    ? 'bg-rose-100 text-rose-700'
                    : percentageSpent >= 85
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                {percentageSpent.toFixed(0)}% used
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isBudgetExceeded
                    ? 'bg-rose-500'
                    : percentageSpent >= 85
                    ? 'bg-amber-500'
                    : 'bg-indigo-600'
                }`}
                style={{ width: `${Math.min(percentageSpent, 100)}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500">
              {isBudgetExceeded ? (
                <span className="text-rose-600 font-bold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Exceeded budget by {format(Math.abs(remaining))}
                </span>
              ) : (
                <span className="text-emerald-600 font-bold">
                  {format(remaining)} remaining
                </span>
              )}
              <span>{Math.max(0, 100 - percentageSpent).toFixed(0)}% left</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


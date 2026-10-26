import React, { useState, useEffect, useCallback } from 'react';
import { PieChart, Settings, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { budgetApi } from '../api/budgetApi';
import { useCurrency } from '../context/CurrencyContext';
import { useToast } from '../context/ToastContext';
import { BudgetProgressBar } from '../components/budget/BudgetProgressBar';
import { CategoryBudgetList } from '../components/budget/CategoryBudgetList';
import { BudgetModal } from '../components/budget/BudgetModal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const BudgetPage = () => {
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);

  const [budgetData, setBudgetData] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { format } = useCurrency();
  const { showToast } = useToast();

  const fetchBudgetInfo = useCallback(async () => {
    setLoading(true);
    try {
      const [compRes, budgetRes] = await Promise.allSettled([
        budgetApi.getComparison(selectedYear, selectedMonth),
        budgetApi.getByYearMonth(selectedYear, selectedMonth),
      ]);

      if (compRes.status === 'fulfilled' && compRes.value.success) {
        setComparison(compRes.value.data);
      } else {
        setComparison(null);
      }

      if (budgetRes.status === 'fulfilled' && budgetRes.value.success) {
        setBudgetData(budgetRes.value.data);
      } else {
        setBudgetData(null);
      }
    } catch (err) {
      console.error(err);
      showToast('Error fetching monthly budget comparison', 'error');
    } finally {
      setLoading(false);
    }
  }, [selectedYear, selectedMonth, showToast]);

  useEffect(() => {
    fetchBudgetInfo();
  }, [fetchBudgetInfo]);

  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const monthName = new Date(selectedYear, selectedMonth - 1).toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-6">
      {/* Header and Month Navigator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Monthly Budget Planner</h2>
          <p className="text-xs sm:text-sm text-slate-500">Plan monthly spending caps and analyze variance against actual outflows</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Month Selector */}
          <div className="flex items-center bg-white border border-slate-200 rounded-2xl p-1 shadow-sm">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-600 transition"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs font-bold text-slate-800 min-w-[120px] text-center">
              {monthName}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-600 transition"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-sm shadow-indigo-200 transition"
          >
            <Settings className="w-4 h-4" />
            <span>{budgetData ? 'Adjust Budget' : 'Set Budget'}</span>
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Analyzing budget metrics..." />
      ) : (
        <>
          {/* Overall Progress Meter */}
          <BudgetProgressBar
            totalBudget={comparison?.totalBudget || budgetData?.totalBudget || 0}
            totalSpent={comparison?.totalSpent || 0}
          />

          {/* Over-budget alert */}
          {comparison?.isOverBudget && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-3 text-sm">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <div>
                <p className="font-bold">Budget Exceeded Alert</p>
                <p className="text-xs text-rose-600">
                  You have spent {format(comparison.totalSpent)} against your target cap of {format(comparison.totalBudget)}.
                </p>
              </div>
            </div>
          )}

          {/* Category-Specific Allocations */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Category Budgets vs. Actuals</h3>
              <span className="text-xs text-slate-400">
                {comparison?.categoryComparisons?.length || 0} categories tracked
              </span>
            </div>

            <CategoryBudgetList comparisons={comparison?.categoryComparisons || []} />
          </div>
        </>
      )}

      {/* Budget Modal */}
      <BudgetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={fetchBudgetInfo}
        currentBudget={budgetData}
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
      />
    </div>
  );
};


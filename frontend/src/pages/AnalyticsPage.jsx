import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';
import { dashboardApi } from '../api/dashboardApi';
import { useCurrency } from '../context/CurrencyContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { MonthlyCashflowChart } from '../components/dashboard/MonthlyCashflowChart';
import { ExpenseCategoryChart } from '../components/dashboard/ExpenseCategoryChart';

export const AnalyticsPage = () => {
  const [monthsCount, setMonthsCount] = useState(6);
  const [trends, setTrends] = useState([]);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [incomeCategories, setIncomeCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const { format } = useCurrency();

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const [trendRes, expRes, incRes] = await Promise.all([
          dashboardApi.getTrends(monthsCount),
          dashboardApi.getExpenseCategories(),
          dashboardApi.getIncomeCategories(),
        ]);

        if (trendRes.success) setTrends(trendRes.data);
        if (expRes.success) setExpenseCategories(expRes.data);
        if (incRes.success) setIncomeCategories(incRes.data);
      } catch (err) {
        console.error('Failed to load analytics', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [monthsCount]);

  const totalIncomeWindow = trends.reduce((sum, t) => sum + Number(t.income || 0), 0);
  const totalExpenseWindow = trends.reduce((sum, t) => sum + Number(t.expense || 0), 0);
  const netSavingsWindow = totalIncomeWindow - totalExpenseWindow;
  const overallSavingsRate = totalIncomeWindow > 0 ? (netSavingsWindow / totalIncomeWindow) * 100 : 0;

  if (loading) {
    return <LoadingSpinner text="Generating financial analytics & reports..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Financial Analytics & Reports</h2>
          <p className="text-xs sm:text-sm text-slate-500">Historical performance, cashflow ratios, and spending breakdown</p>
        </div>

        {/* Range Toggle */}
        <div className="flex items-center bg-white border border-slate-200 rounded-2xl p-1 shadow-sm">
          <button
            onClick={() => setMonthsCount(6)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              monthsCount === 6 ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Last 6 Months
          </button>
          <button
            onClick={() => setMonthsCount(12)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              monthsCount === 12 ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Last 12 Months
          </button>
        </div>
      </div>

      {/* Aggregate Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Income ({monthsCount}M)</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">{format(totalIncomeWindow)}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Outflow ({monthsCount}M)</span>
          <p className="text-2xl font-black text-rose-600 mt-1">{format(totalExpenseWindow)}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Net Surplus / Savings</span>
          <p className={`text-2xl font-black mt-1 ${netSavingsWindow >= 0 ? 'text-indigo-600' : 'text-rose-600'}`}>
            {format(netSavingsWindow)}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Cumulative Savings Rate</span>
          <p className={`text-2xl font-black mt-1 ${overallSavingsRate >= 20 ? 'text-emerald-600' : 'text-amber-600'}`}>
            {overallSavingsRate.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MonthlyCashflowChart trends={trends} />
        <ExpenseCategoryChart categories={expenseCategories} title="Expense Breakdown (All Time)" />
      </div>

      {/* Monthly Breakdown Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900">Historical Cash Flow Statement</h3>
          <p className="text-xs text-slate-400">Detailed month-by-month financial summary</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-4">Month</th>
                <th className="px-6 py-4 text-right">Income</th>
                <th className="px-6 py-4 text-right">Expense</th>
                <th className="px-6 py-4 text-right">Net Savings</th>
                <th className="px-6 py-4 text-right">Savings Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {trends.map((item, idx) => {
                const inc = Number(item.income || 0);
                const exp = Number(item.expense || 0);
                const net = Number(item.netSavings || 0);
                const rate = inc > 0 ? (net / inc) * 100 : 0;

                return (
                  <tr key={idx} className="hover:bg-slate-50/60 transition">
                    <td className="px-6 py-4 font-bold text-slate-800">{item.monthLabel}</td>
                    <td className="px-6 py-4 text-right font-extrabold text-emerald-600">+{format(inc)}</td>
                    <td className="px-6 py-4 text-right font-extrabold text-rose-600">-{format(exp)}</td>
                    <td className={`px-6 py-4 text-right font-black ${net >= 0 ? 'text-indigo-600' : 'text-rose-600'}`}>
                      {format(net)}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-slate-600">
                      {rate.toFixed(1)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};


import React, { useState, useEffect, useCallback } from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  PiggyBank,
  Percent,
  CalendarClock,
  PieChart,
  RefreshCw,
} from 'lucide-react';
import { dashboardApi } from '../api/dashboardApi';
import { billApi } from '../api/billApi';
import { incomeApi } from '../api/incomeApi';
import { expenseApi } from '../api/expenseApi';
import { useCurrency } from '../context/CurrencyContext';
import { useToast } from '../context/ToastContext';
import { StatCard } from '../components/common/StatCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { MonthlyCashflowChart } from '../components/dashboard/MonthlyCashflowChart';
import { ExpenseCategoryChart } from '../components/dashboard/ExpenseCategoryChart';
import { UpcomingBillsWidget } from '../components/dashboard/UpcomingBillsWidget';
import { BudgetProgressWidget } from '../components/dashboard/BudgetProgressWidget';
import { RecentTransactions } from '../components/dashboard/RecentTransactions';

export const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [summary, setSummary] = useState(null);
  const [trends, setTrends] = useState([]);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [upcomingBills, setUpcomingBills] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);

  const { format } = useCurrency();
  const { showToast } = useToast();

  const fetchDashboardData = useCallback(async () => {
    try {
      const [sumRes, trendRes, catRes, billsRes, incRes, expRes] = await Promise.all([
        dashboardApi.getSummary(),
        dashboardApi.getTrends(6),
        dashboardApi.getExpenseCategories(),
        billApi.getUpcoming(14),
        incomeApi.getAll(),
        expenseApi.getAll(),
      ]);

      if (sumRes.success) setSummary(sumRes.data);
      if (trendRes.success) setTrends(trendRes.data);
      if (catRes.success) setExpenseCategories(catRes.data);
      if (billsRes.success) setUpcomingBills(billsRes.data);

      // Merge and sort recent incomes & expenses
      const allTxs = [
        ...(incRes.data || []).map((i) => ({ ...i, type: 'INCOME' })),
        ...(expRes.data || []).map((e) => ({ ...e, type: 'EXPENSE' })),
      ].sort((a, b) => new Date(b.date) - new Date(a.date));

      setRecentTransactions(allTxs);
    } catch (err) {
      console.error('Failed to load dashboard data', err);
      showToast('Error loading financial summary', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchDashboardData();

    // Listen to global financial changes
    const handler = () => fetchDashboardData();
    window.addEventListener('finance-data-updated', handler);
    return () => window.removeEventListener('finance-data-updated', handler);
  }, [fetchDashboardData]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const handleMarkBillPaid = async (billId) => {
    try {
      await billApi.markAsPaid(billId);
      showToast('Bill marked as paid!', 'success');
      fetchDashboardData();
    } catch (err) {
      showToast('Failed to update bill', 'error');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Crunching financial insights..." />;
  }

  return (
    <div className="space-y-6">
      {/* Top Banner / Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Financial Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Overview for {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 shadow-sm transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Primary KPI StatCards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Monthly Income"
          value={format(summary?.monthlyIncome || 0)}
          subtitle="Received this month"
          icon={ArrowDownLeft}
          color="emerald"
        />

        <StatCard
          title="Monthly Expenses"
          value={format(summary?.monthlyExpense || 0)}
          subtitle="Spent this month"
          icon={ArrowUpRight}
          color="rose"
        />

        <StatCard
          title="Net Monthly Savings"
          value={format(summary?.monthlyNetSavings || 0)}
          subtitle="Income minus expenses"
          icon={PiggyBank}
          color={Number(summary?.monthlyNetSavings || 0) >= 0 ? 'indigo' : 'rose'}
        />

        <StatCard
          title="Savings Rate"
          value={`${(summary?.monthlySavingsRate || 0).toFixed(1)}%`}
          subtitle="Of income retained"
          icon={Percent}
          color={Number(summary?.monthlySavingsRate || 0) >= 20 ? 'emerald' : 'amber'}
        />
      </div>

      {/* Secondary Quick Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Net Worth"
          value={format(summary?.netWorth || 0)}
          subtitle="All-time cumulative savings"
          icon={PiggyBank}
          color="blue"
        />

        <StatCard
          title="Pending Bills Due"
          value={format(summary?.pendingBillsAmount || 0)}
          subtitle={`${summary?.pendingBillsCount || 0} bills pending (${summary?.overdueBillsCount || 0} overdue)`}
          icon={CalendarClock}
          color={summary?.overdueBillsCount > 0 ? 'rose' : 'amber'}
        />

        <StatCard
          title="Monthly Budget Cap"
          value={format(summary?.currentMonthBudget || 0)}
          subtitle={
            summary?.currentMonthBudget > 0
              ? `${(summary?.budgetSpentPercentage || 0).toFixed(1)}% consumed`
              : 'No budget set for this month'
          }
          icon={PieChart}
          color={summary?.isBudgetExceeded ? 'rose' : 'purple'}
        />
      </div>

      {/* Main Trends & Breakdown Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MonthlyCashflowChart trends={trends} />
        </div>
        <div>
          <ExpenseCategoryChart categories={expenseCategories} />
        </div>
      </div>

      {/* Widgets Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <UpcomingBillsWidget
          bills={upcomingBills}
          onMarkPaid={handleMarkBillPaid}
        />

        <BudgetProgressWidget
          monthlyBudget={summary?.currentMonthBudget || 0}
          monthlyExpense={summary?.monthlyExpense || 0}
          percentageSpent={summary?.budgetSpentPercentage || 0}
          isBudgetExceeded={summary?.isBudgetExceeded || false}
        />

        <RecentTransactions transactions={recentTransactions} />
      </div>
    </div>
  );
};


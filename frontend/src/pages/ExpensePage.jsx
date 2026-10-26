import React, { useState, useEffect, useCallback } from 'react';
import { Plus, ArrowUpRight, DollarSign, ListFilter } from 'lucide-react';
import { expenseApi } from '../api/expenseApi';
import { useCurrency } from '../context/CurrencyContext';
import { useToast } from '../context/ToastContext';
import { ExpenseTable } from '../components/expense/ExpenseTable';
import { ExpenseModal } from '../components/expense/ExpenseModal';
import { ExpenseFilter } from '../components/expense/ExpenseFilter';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';

export const ExpensePage = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { format } = useCurrency();
  const { showToast } = useToast();

  const fetchExpenses = useCallback(async () => {
    try {
      const params = {};
      if (category) params.category = category;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const res = await expenseApi.getAll(params);
      if (res.success) {
        setExpenses(res.data);
      }
    } catch (err) {
      showToast('Failed to load expense entries', 'error');
    } finally {
      setLoading(false);
    }
  }, [category, startDate, endDate, showToast]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleResetFilters = () => {
    setSearch('');
    setCategory('');
    setStartDate('');
    setEndDate('');
  };

  const handleEdit = (expense) => {
    setExpenseToEdit(expense);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!expenseToDelete) return;
    setDeleting(true);
    try {
      await expenseApi.delete(expenseToDelete.id);
      showToast('Expense entry deleted');
      setExpenseToDelete(null);
      fetchExpenses();
    } catch (err) {
      showToast('Failed to delete expense', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const filteredExpenses = expenses.filter((e) =>
    search ? e.title.toLowerCase().includes(search.toLowerCase()) || e.notes?.toLowerCase().includes(search.toLowerCase()) : true
  );

  const totalFilteredExpense = filteredExpenses.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Expense Tracker</h2>
          <p className="text-xs sm:text-sm text-slate-500">Track and categorize daily outflows and purchases</p>
        </div>

        <button
          onClick={() => {
            setExpenseToEdit(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-bold shadow-sm shadow-rose-200 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Expense</span>
        </button>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
            <ArrowUpRight className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">Total Filtered Expenses</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{format(totalFilteredExpense)}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <ListFilter className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">Total Entries</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{filteredExpenses.length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">Average Expense</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">
              {format(filteredExpenses.length > 0 ? totalFilteredExpense / filteredExpenses.length : 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <ExpenseFilter
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        onReset={handleResetFilters}
      />

      {/* Table or Empty state */}
      {loading ? (
        <LoadingSpinner text="Fetching your expenses..." />
      ) : filteredExpenses.length === 0 ? (
        <EmptyState
          icon={ArrowUpRight}
          title="No expenses found"
          description={
            search || category || startDate || endDate
              ? 'Try modifying your filter parameters to see more records.'
              : 'Log your purchases, coffee, utility bills, or grocery runs.'
          }
          actionLabel="Log First Expense"
          onAction={() => {
            setExpenseToEdit(null);
            setIsModalOpen(true);
          }}
        />
      ) : (
        <ExpenseTable
          expenses={filteredExpenses}
          onEdit={handleEdit}
          onDelete={(expense) => setExpenseToDelete(expense)}
        />
      )}

      {/* Expense Modal */}
      <ExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={fetchExpenses}
        expenseToEdit={expenseToEdit}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!expenseToDelete}
        onClose={() => setExpenseToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Expense Record?"
        message={`Are you sure you want to delete "${expenseToDelete?.title}" for ${format(expenseToDelete?.amount || 0)}?`}
        loading={deleting}
      />
    </div>
  );
};


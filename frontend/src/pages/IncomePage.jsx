import React, { useState, useEffect, useCallback } from 'react';
import { Plus, ArrowDownLeft, DollarSign, ListFilter } from 'lucide-react';
import { incomeApi } from '../api/incomeApi';
import { useCurrency } from '../context/CurrencyContext';
import { useToast } from '../context/ToastContext';
import { IncomeTable } from '../components/income/IncomeTable';
import { IncomeModal } from '../components/income/IncomeModal';
import { IncomeFilter } from '../components/income/IncomeFilter';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';

export const IncomePage = () => {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [incomeToEdit, setIncomeToEdit] = useState(null);
  const [incomeToDelete, setIncomeToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { format } = useCurrency();
  const { showToast } = useToast();

  const fetchIncomes = useCallback(async () => {
    try {
      const params = {};
      if (category) params.category = category;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const res = await incomeApi.getAll(params);
      if (res.success) {
        setIncomes(res.data);
      }
    } catch (err) {
      showToast('Failed to load income entries', 'error');
    } finally {
      setLoading(false);
    }
  }, [category, startDate, endDate, showToast]);

  useEffect(() => {
    fetchIncomes();
  }, [fetchIncomes]);

  const handleResetFilters = () => {
    setSearch('');
    setCategory('');
    setStartDate('');
    setEndDate('');
  };

  const handleEdit = (income) => {
    setIncomeToEdit(income);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!incomeToDelete) return;
    setDeleting(true);
    try {
      await incomeApi.delete(incomeToDelete.id);
      showToast('Income entry deleted');
      setIncomeToDelete(null);
      fetchIncomes();
    } catch (err) {
      showToast('Failed to delete income', 'error');
    } finally {
      setDeleting(false);
    }
  };

  // Filter client-side search query
  const filteredIncomes = incomes.filter((i) =>
    search ? i.title.toLowerCase().includes(search.toLowerCase()) || i.description?.toLowerCase().includes(search.toLowerCase()) : true
  );

  const totalFilteredIncome = filteredIncomes.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Income Tracker</h2>
          <p className="text-xs sm:text-sm text-slate-500">Record, filter, and monitor all money coming in</p>
        </div>

        <button
          onClick={() => {
            setIncomeToEdit(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-sm shadow-emerald-200 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Income</span>
        </button>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <ArrowDownLeft className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">Total Filtered Income</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{format(totalFilteredIncome)}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <ListFilter className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">Total Entries</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{filteredIncomes.length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">Average Entry</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">
              {format(filteredIncomes.length > 0 ? totalFilteredIncome / filteredIncomes.length : 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <IncomeFilter
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
        <LoadingSpinner text="Fetching your income entries..." />
      ) : filteredIncomes.length === 0 ? (
        <EmptyState
          icon={ArrowDownLeft}
          title="No income records found"
          description={
            search || category || startDate || endDate
              ? 'Try modifying your filter parameters to see more records.'
              : 'Start logging your salary, side gigs, or dividend incomes.'
          }
          actionLabel="Log First Income"
          onAction={() => {
            setIncomeToEdit(null);
            setIsModalOpen(true);
          }}
        />
      ) : (
        <IncomeTable
          incomes={filteredIncomes}
          onEdit={handleEdit}
          onDelete={(income) => setIncomeToDelete(income)}
        />
      )}

      {/* Income Modal */}
      <IncomeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={fetchIncomes}
        incomeToEdit={incomeToEdit}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!incomeToDelete}
        onClose={() => setIncomeToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Income Record?"
        message={`Are you sure you want to delete "${incomeToDelete?.title}" for ${format(incomeToDelete?.amount || 0)}? This will recalculate your monthly totals.`}
        loading={deleting}
      />
    </div>
  );
};


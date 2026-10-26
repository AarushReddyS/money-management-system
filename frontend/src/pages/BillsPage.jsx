import React, { useState, useEffect, useCallback } from 'react';
import { Plus, CalendarClock, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { billApi } from '../api/billApi';
import { useCurrency } from '../context/CurrencyContext';
import { useToast } from '../context/ToastContext';
import { BillCard } from '../components/bills/BillCard';
import { BillModal } from '../components/bills/BillModal';
import { BillFilter } from '../components/bills/BillFilter';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';

export const BillsPage = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [billToEdit, setBillToEdit] = useState(null);
  const [billToDelete, setBillToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { format } = useCurrency();
  const { showToast } = useToast();

  const fetchBills = useCallback(async () => {
    try {
      const res = await billApi.getAll(statusFilter ? { status: statusFilter } : {});
      if (res.success) {
        setBills(res.data);
      }
    } catch (err) {
      showToast('Failed to load bills', 'error');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, showToast]);

  useEffect(() => {
    fetchBills();
  }, [fetchBills]);

  const handleEdit = (bill) => {
    setBillToEdit(bill);
    setIsModalOpen(true);
  };

  const handleMarkPaid = async (billId) => {
    try {
      await billApi.markAsPaid(billId);
      showToast('Bill marked as paid! 🎉');
      fetchBills();
    } catch (err) {
      showToast('Failed to mark bill as paid', 'error');
    }
  };

  const handleStatusChange = async (billId, status) => {
    try {
      await billApi.updateStatus(billId, status);
      showToast(`Bill status updated to ${status}`);
      fetchBills();
    } catch (err) {
      showToast('Failed to update bill status', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!billToDelete) return;
    setDeleting(true);
    try {
      await billApi.delete(billToDelete.id);
      showToast('Bill deleted');
      setBillToDelete(null);
      fetchBills();
    } catch (err) {
      showToast('Failed to delete bill', 'error');
    } finally {
      setDeleting(false);
    }
  };

  // Compute status counts
  const counts = {
    all: bills.length,
    pending: bills.filter((b) => b.status === 'PENDING').length,
    overdue: bills.filter((b) => b.status === 'OVERDUE' || b.overdue).length,
    paid: bills.filter((b) => b.status === 'PAID').length,
  };

  const pendingTotal = bills
    .filter((b) => b.status === 'PENDING' || b.status === 'OVERDUE')
    .reduce((sum, b) => sum + Number(b.amount || 0), 0);

  const overdueTotal = bills
    .filter((b) => b.status === 'OVERDUE' || b.overdue)
    .reduce((sum, b) => sum + Number(b.amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Bills & Dues Manager</h2>
          <p className="text-xs sm:text-sm text-slate-500">Track due dates, recurring utilities, and avoid late fees</p>
        </div>

        <button
          onClick={() => {
            setBillToEdit(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-sm shadow-indigo-200 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Bill</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">Total Pending Dues</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{format(pendingTotal)}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">Overdue Invoices</p>
            <p className="text-2xl font-black text-rose-600 mt-0.5">{format(overdueTotal)}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">Paid In Full</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{counts.paid} bills</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <BillFilter
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        counts={counts}
      />

      {/* Grid or Empty */}
      {loading ? (
        <LoadingSpinner text="Loading bills..." />
      ) : bills.length === 0 ? (
        <EmptyState
          icon={CalendarClock}
          title="No bills found"
          description={
            statusFilter
              ? `There are no ${statusFilter.toLowerCase()} bills at the moment.`
              : 'Add your rent, electric, internet, or credit card bills to stay on track.'
          }
          actionLabel="Add Bill"
          onAction={() => {
            setBillToEdit(null);
            setIsModalOpen(true);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bills.map((bill) => (
            <BillCard
              key={bill.id}
              bill={bill}
              onEdit={handleEdit}
              onDelete={(b) => setBillToDelete(b)}
              onMarkPaid={handleMarkPaid}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}

      {/* Bill Modal */}
      <BillModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={fetchBills}
        billToEdit={billToEdit}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!billToDelete}
        onClose={() => setBillToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Bill?"
        message={`Are you sure you want to delete "${billToDelete?.title}"?`}
        loading={deleting}
      />
    </div>
  );
};


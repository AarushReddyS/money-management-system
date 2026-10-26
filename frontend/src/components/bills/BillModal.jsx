import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { billApi } from '../../api/billApi';
import { BILL_CATEGORIES, RECURRENCE_FREQUENCIES } from '../../utils/constants';
import { useToast } from '../../context/ToastContext';

export const BillModal = ({ isOpen, onClose, onSaved, billToEdit }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'ELECTRICITY',
    dueDate: new Date().toISOString().split('T')[0],
    isRecurring: true,
    recurrenceFrequency: 'MONTHLY',
    autoPay: false,
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (billToEdit) {
      setFormData({
        title: billToEdit.title || '',
        amount: billToEdit.amount || '',
        category: billToEdit.category || 'ELECTRICITY',
        dueDate: billToEdit.dueDate || new Date().toISOString().split('T')[0],
        isRecurring: billToEdit.isRecurring !== undefined ? billToEdit.isRecurring : true,
        recurrenceFrequency: billToEdit.recurrenceFrequency || 'MONTHLY',
        autoPay: billToEdit.autoPay || false,
        notes: billToEdit.notes || '',
      });
    } else {
      setFormData({
        title: '',
        amount: '',
        category: 'ELECTRICITY',
        dueDate: new Date().toISOString().split('T')[0],
        isRecurring: true,
        recurrenceFrequency: 'MONTHLY',
        autoPay: false,
        notes: '',
      });
    }
  }, [billToEdit, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Bill title is required', 'error');
      return;
    }
    if (!formData.amount || Number(formData.amount) <= 0) {
      showToast('Please enter a valid bill amount', 'error');
      return;
    }

    setLoading(true);
    try {
      if (billToEdit) {
        await billApi.update(billToEdit.id, formData);
      } else {
        await billApi.create(formData);
      }
      onSaved();
      onClose();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save bill', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={billToEdit ? 'Edit Bill' : 'Add Bill / Due Payment'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Bill Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. WiFi Fiber Net, Apartment Rent"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Amount Due *
            </label>
            <input
              type="number"
              step="0.01"
              required
              min="0.01"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition bg-white"
            >
              {BILL_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Due Date *
            </label>
            <input
              type="date"
              required
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Recurrence
            </label>
            <select
              value={formData.recurrenceFrequency}
              onChange={(e) => setFormData({ ...formData, recurrenceFrequency: e.target.value })}
              disabled={!formData.isRecurring}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition bg-white disabled:bg-slate-100 disabled:text-slate-400"
            >
              {RECURRENCE_FREQUENCIES.map((rf) => (
                <option key={rf.value} value={rf.value}>
                  {rf.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-6 pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isRecurring}
              onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
              className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 border-slate-300"
            />
            <span className="text-sm font-semibold text-slate-700">Recurring Bill</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.autoPay}
              onChange={(e) => setFormData({ ...formData, autoPay: e.target.checked })}
              className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 border-slate-300"
            />
            <span className="text-sm font-semibold text-slate-700">Auto-Pay Enabled</span>
          </label>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Notes / Account Number (Optional)
          </label>
          <textarea
            rows="2"
            placeholder="Account number, portal link or notes..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition resize-none"
          />
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-sm shadow-indigo-200 transition"
          >
            {loading ? 'Saving...' : billToEdit ? 'Update Bill' : 'Save Bill'}
          </button>
        </div>
      </form>
    </Modal>
  );
};


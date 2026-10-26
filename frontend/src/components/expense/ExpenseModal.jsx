import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { expenseApi } from '../../api/expenseApi';
import { EXPENSE_CATEGORIES, PAYMENT_METHODS } from '../../utils/constants';
import { useToast } from '../../context/ToastContext';

export const ExpenseModal = ({ isOpen, onClose, onSaved, expenseToEdit }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'GROCERIES',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'CREDIT_CARD',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (expenseToEdit) {
      setFormData({
        title: expenseToEdit.title || '',
        amount: expenseToEdit.amount || '',
        category: expenseToEdit.category || 'GROCERIES',
        date: expenseToEdit.date || new Date().toISOString().split('T')[0],
        paymentMethod: expenseToEdit.paymentMethod || 'CREDIT_CARD',
        notes: expenseToEdit.notes || '',
      });
    } else {
      setFormData({
        title: '',
        amount: '',
        category: 'GROCERIES',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'CREDIT_CARD',
        notes: '',
      });
    }
  }, [expenseToEdit, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Title is required', 'error');
      return;
    }
    if (!formData.amount || Number(formData.amount) <= 0) {
      showToast('Please enter a valid amount greater than 0', 'error');
      return;
    }

    setLoading(true);
    try {
      if (expenseToEdit) {
        await expenseApi.update(expenseToEdit.id, formData);
      } else {
        await expenseApi.create(formData);
      }
      onSaved();
      onClose();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save expense record', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={expenseToEdit ? 'Edit Expense' : 'Log New Expense'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Expense Title *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Supermarket Groceries, Uber Ride"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Amount Spent *
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
              {EXPENSE_CATEGORIES.map((cat) => (
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
              Expense Date *
            </label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Payment Method
            </label>
            <select
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition bg-white"
            >
              {PAYMENT_METHODS.map((pm) => (
                <option key={pm.value} value={pm.value}>
                  {pm.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Notes / Details (Optional)
          </label>
          <textarea
            rows="3"
            placeholder="Add any receipts or details..."
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
            className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-semibold shadow-sm shadow-rose-200 transition"
          >
            {loading ? 'Saving...' : expenseToEdit ? 'Update Expense' : 'Add Expense'}
          </button>
        </div>
      </form>
    </Modal>
  );
};


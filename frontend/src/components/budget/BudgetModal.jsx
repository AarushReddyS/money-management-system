import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { budgetApi } from '../../api/budgetApi';
import { EXPENSE_CATEGORIES } from '../../utils/constants';
import { useToast } from '../../context/ToastContext';
import { Plus, Trash2 } from 'lucide-react';

export const BudgetModal = ({ isOpen, onClose, onSaved, currentBudget, selectedYear, selectedMonth }) => {
  const [totalBudget, setTotalBudget] = useState('');
  const [notes, setNotes] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (currentBudget) {
      setTotalBudget(currentBudget.totalBudget || '');
      setNotes(currentBudget.notes || '');
      setCategories(
        currentBudget.categories && currentBudget.categories.length > 0
          ? currentBudget.categories.map((c) => ({
              category: c.category,
              allocatedAmount: c.allocatedAmount,
            }))
          : []
      );
    } else {
      setTotalBudget('');
      setNotes('');
      setCategories([
        { category: 'HOUSING', allocatedAmount: '' },
        { category: 'GROCERIES', allocatedAmount: '' },
        { category: 'UTILITIES', allocatedAmount: '' },
      ]);
    }
  }, [currentBudget, isOpen]);

  const handleAddCategoryRow = () => {
    setCategories([...categories, { category: 'DINING_OUT', allocatedAmount: '' }]);
  };

  const handleRemoveCategoryRow = (index) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  const handleCategoryChange = (index, field, value) => {
    const updated = [...categories];
    updated[index][field] = value;
    setCategories(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!totalBudget || Number(totalBudget) <= 0) {
      showToast('Please specify a valid total monthly budget', 'error');
      return;
    }

    const validCategories = categories
      .filter((c) => c.category && Number(c.allocatedAmount) > 0)
      .map((c) => ({
        category: c.category,
        allocatedAmount: Number(c.allocatedAmount),
      }));

    setLoading(true);
    try {
      await budgetApi.saveBudget({
        year: selectedYear,
        month: selectedMonth,
        totalBudget: Number(totalBudget),
        notes,
        categories: validCategories,
      });
      showToast('Budget configured successfully!');
      onSaved();
      onClose();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save budget', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Configure Budget for ${new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}`}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Total Monthly Budget Cap *
          </label>
          <input
            type="number"
            step="0.01"
            required
            min="0.01"
            placeholder="e.g. 3500.00"
            value={totalBudget}
            onChange={(e) => setTotalBudget(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition font-semibold"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Budget Target Notes (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Saving for vacation, lean spending month"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
          />
        </div>

        {/* Category breakdown allocations */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Category Allocations (Optional)
            </label>
            <button
              type="button"
              onClick={handleAddCategoryRow}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Category</span>
            </button>
          </div>

          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {categories.map((row, index) => (
              <div key={index} className="flex items-center gap-2">
                <select
                  value={row.category}
                  onChange={(e) => handleCategoryChange(index, 'category', e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white outline-none"
                >
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="Limit"
                  value={row.allocatedAmount}
                  onChange={(e) => handleCategoryChange(index, 'allocatedAmount', e.target.value)}
                  className="w-32 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white outline-none"
                />

                <button
                  type="button"
                  onClick={() => handleRemoveCategoryRow(index)}
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
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
            {loading ? 'Saving...' : 'Set Budget'}
          </button>
        </div>
      </form>
    </Modal>
  );
};


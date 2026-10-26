import React from 'react';
import { Edit2, Trash2, ArrowUpRight } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { formatDate } from '../../utils/formatters';
import { EXPENSE_CATEGORIES } from '../../utils/constants';

export const ExpenseTable = ({ expenses, onEdit, onDelete }) => {
  const { format } = useCurrency();

  const getCategoryBadge = (categoryKey) => {
    const found = EXPENSE_CATEGORIES.find((c) => c.value === categoryKey);
    return found ? (
      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${found.bg}`}>
        {found.label}
      </span>
    ) : (
      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
        {categoryKey}
      </span>
    );
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50/80 border-b border-slate-200/80 text-xs font-bold uppercase tracking-wider text-slate-500">
          <tr>
            <th className="px-6 py-4">Expense Title</th>
            <th className="px-6 py-4">Category</th>
            <th className="px-6 py-4">Date</th>
            <th className="px-6 py-4">Payment Method</th>
            <th className="px-6 py-4 text-right">Amount</th>
            <th className="px-6 py-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {expenses.map((expense) => (
            <tr key={expense.id} className="hover:bg-slate-50/60 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-rose-50 text-rose-600 shrink-0">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{expense.title}</p>
                    {expense.notes && (
                      <p className="text-xs text-slate-400 max-w-xs truncate">{expense.notes}</p>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getCategoryBadge(expense.category)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                {formatDate(expense.date)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 font-medium">
                {expense.paymentMethod?.replace('_', ' ')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right font-extrabold text-rose-600">
                -{format(expense.amount)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="flex items-center justify-center gap-1">
                  <button
                    onClick={() => onEdit(expense)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(expense)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


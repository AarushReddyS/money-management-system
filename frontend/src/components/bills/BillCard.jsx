import React, { useState } from 'react';
import { Calendar, Check, Clock, AlertCircle, Edit2, Trash2, Repeat, Zap } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { formatDate, getDueLabel } from '../../utils/formatters';
import { BILL_CATEGORIES } from '../../utils/constants';

export const BillCard = ({ bill, onEdit, onDelete, onMarkPaid, onStatusChange }) => {
  const { format } = useCurrency();
  const [paying, setPaying] = useState(false);

  const dueInfo = getDueLabel(bill.dueDate, bill.status);
  const categoryLabel = BILL_CATEGORIES.find((c) => c.value === bill.category)?.label || bill.category;

  const handlePay = async () => {
    setPaying(true);
    try {
      await onMarkPaid(bill.id);
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className={`p-5 rounded-2xl bg-white border transition-all hover:shadow-md ${
      bill.status === 'PAID'
        ? 'border-emerald-200/80 bg-emerald-50/20'
        : bill.overdue || bill.status === 'OVERDUE'
        ? 'border-rose-200/80 bg-rose-50/10'
        : 'border-slate-200/80'
    }`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-xs font-semibold text-slate-500">{categoryLabel}</span>
          <h4 className="text-base font-bold text-slate-900 mt-0.5">{bill.title}</h4>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${dueInfo.color}`}>
          {dueInfo.text}
        </span>
      </div>

      <div className="my-4 flex items-baseline justify-between">
        <div>
          <span className="text-2xl font-extrabold text-slate-900">{format(bill.amount)}</span>
          <span className="text-xs text-slate-400 ml-1">due {formatDate(bill.dueDate)}</span>
        </div>

        <div className="flex items-center gap-2">
          {bill.isRecurring && (
            <span
              title={`Recurring: ${bill.recurrenceFrequency?.toLowerCase()}`}
              className="p-1 rounded-lg bg-indigo-50 text-indigo-600 text-xs flex items-center gap-1 font-semibold px-2"
            >
              <Repeat className="w-3 h-3" />
              <span className="capitalize text-[11px]">{bill.recurrenceFrequency?.toLowerCase()}</span>
            </span>
          )}
          {bill.autoPay && (
            <span title="Auto-Pay enabled" className="p-1 rounded-lg bg-amber-50 text-amber-600">
              <Zap className="w-3.5 h-3.5" />
            </span>
          )}
        </div>
      </div>

      {bill.notes && (
        <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-4 line-clamp-2">
          {bill.notes}
        </p>
      )}

      {/* Actions */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(bill)}
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(bill)}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {bill.status !== 'PAID' ? (
          <button
            onClick={handlePay}
            disabled={paying}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-emerald-200 transition"
          >
            <Check className="w-3.5 h-3.5" />
            <span>{paying ? 'Processing...' : 'Mark Paid'}</span>
          </button>
        ) : (
          <button
            onClick={() => onStatusChange(bill.id, 'PENDING')}
            className="text-xs text-slate-400 hover:text-slate-600 font-semibold underline"
          >
            Mark as Unpaid
          </button>
        )}
      </div>
    </div>
  );
};


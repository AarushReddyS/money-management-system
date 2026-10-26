import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarClock, Check, ArrowRight } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { formatDate, getDueLabel } from '../../utils/formatters';

export const UpcomingBillsWidget = ({ bills = [], onMarkPaid }) => {
  const { format } = useCurrency();

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <CalendarClock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Upcoming Bills</h3>
              <p className="text-xs text-slate-500">Due within next 14 days</p>
            </div>
          </div>
          <Link
            to="/bills"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {bills.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            🎉 No bills due in the next 14 days!
          </div>
        ) : (
          <div className="space-y-3">
            {bills.slice(0, 4).map((bill) => {
              const dueInfo = getDueLabel(bill.dueDate, bill.status);
              return (
                <div
                  key={bill.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100/60 transition"
                >
                  <div className="min-w-0 pr-2">
                    <p className="text-xs font-bold text-slate-800 truncate">{bill.title}</p>
                    <p className="text-[11px] text-slate-400">Due: {formatDate(bill.dueDate)}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right">
                      <p className="text-xs font-extrabold text-slate-900">{format(bill.amount)}</p>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${dueInfo.color}`}>
                        {dueInfo.text}
                      </span>
                    </div>

                    {onMarkPaid && (
                      <button
                        onClick={() => onMarkPaid(bill.id)}
                        title="Mark as Paid"
                        className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-lg transition"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {bills.length > 4 && (
        <p className="text-[11px] text-slate-400 text-center mt-3">
          + {bills.length - 4} more upcoming dues
        </p>
      )}
    </div>
  );
};


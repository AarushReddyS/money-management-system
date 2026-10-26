import React from 'react';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { formatDate } from '../../utils/formatters';

export const RecentTransactions = ({ transactions = [] }) => {
  const { format } = useCurrency();

  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm text-center text-slate-400 text-xs py-8">
        No recent transactions found.
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
      <h3 className="text-base font-bold text-slate-900 mb-1">Recent Activity</h3>
      <p className="text-xs text-slate-500 mb-4">Latest financial movements</p>

      <div className="divide-y divide-slate-100">
        {transactions.slice(0, 6).map((tx) => {
          const isIncome = tx.type === 'INCOME';

          return (
            <div key={`${tx.type}-${tx.id}`} className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-xl shrink-0 ${
                    isIncome ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                  }`}
                >
                  {isIncome ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">{tx.title}</p>
                  <p className="text-[11px] text-slate-400">{formatDate(tx.date)} • {tx.category?.replace('_', ' ')}</p>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`text-xs font-black ${
                    isIncome ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {isIncome ? `+${format(tx.amount)}` : `-${format(tx.amount)}`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


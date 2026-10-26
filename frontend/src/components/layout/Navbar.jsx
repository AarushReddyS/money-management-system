import React from 'react';
import { Menu, Plus, Globe } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCurrency } from '../../context/CurrencyContext';
import { CURRENCIES } from '../../utils/constants';

export const Navbar = ({ onOpenSidebar, onQuickIncome, onQuickExpense }) => {
  const { user } = useAuth();
  const { currency, setCurrency } = useCurrency();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="p-2 -ml-2 text-slate-500 rounded-xl hover:bg-slate-100 lg:hidden transition"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900">
            Welcome back, <span className="text-indigo-600">{user?.fullName || user?.username}</span> 👋
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Currency Selector */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700">
          <Globe className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="bg-transparent border-none outline-none cursor-pointer text-slate-800 font-bold"
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.symbol} {c.code}
              </option>
            ))}
          </select>
        </div>

        {/* Quick Add Buttons */}
        <div className="flex items-center gap-2">
          {onQuickIncome && (
            <button
              onClick={onQuickIncome}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Income</span>
            </button>
          )}

          {onQuickExpense && (
            <button
              onClick={onQuickExpense}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Expense</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};


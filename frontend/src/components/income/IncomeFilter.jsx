import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { INCOME_CATEGORIES } from '../../utils/constants';

export const IncomeFilter = ({
  search,
  setSearch,
  category,
  setCategory,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onReset,
}) => {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-4">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search income by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
        />
      </div>

      {/* Category Dropdown */}
      <div className="w-full sm:w-48">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-indigo-500 outline-none transition cursor-pointer"
        >
          <option value="">All Categories</option>
          {INCOME_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* Date Range */}
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white outline-none"
        />
        <span className="text-slate-400 text-xs">to</span>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white outline-none"
        />
      </div>

      {/* Reset */}
      {(search || category || startDate || endDate) && (
        <button
          onClick={onReset}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition"
          title="Reset Filters"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};


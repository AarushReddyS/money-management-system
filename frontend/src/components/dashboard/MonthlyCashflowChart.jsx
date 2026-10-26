import React, { useState } from 'react';
import { useCurrency } from '../../context/CurrencyContext';

export const MonthlyCashflowChart = ({ trends = [] }) => {
  const { format } = useCurrency();
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (!trends || trends.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
        No monthly history data available yet.
      </div>
    );
  }

  // Find max value for scaling
  const maxVal = Math.max(
    ...trends.map((t) => Math.max(Number(t.income || 0), Number(t.expense || 0))),
    100
  );

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-900">Cash Flow History</h3>
          <p className="text-xs text-slate-500">Income vs. Expense over the last {trends.length} months</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
            <span className="text-slate-600">Income</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
            <span className="text-slate-600">Expense</span>
          </div>
        </div>
      </div>

      {/* Chart Bars Container */}
      <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 pt-8 pb-2 border-b border-slate-100">
        {trends.map((item, idx) => {
          const incHeight = Math.max((Number(item.income || 0) / maxVal) * 100, 2);
          const expHeight = Math.max((Number(item.expense || 0) / maxVal) * 100, 2);

          return (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center h-full justify-end relative group cursor-pointer"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Tooltip */}
              {hoveredIdx === idx && (
                <div className="absolute -top-14 z-20 bg-slate-900 text-white text-[11px] rounded-xl px-3 py-2 shadow-xl whitespace-nowrap pointer-events-none transform -translate-x-1/2 left-1/2">
                  <p className="font-bold border-b border-slate-700 pb-1 mb-1">{item.monthLabel}</p>
                  <p className="text-emerald-400">Income: {format(item.income)}</p>
                  <p className="text-rose-400">Expense: {format(item.expense)}</p>
                  <p className="text-slate-300">Net: {format(item.netSavings)}</p>
                </div>
              )}

              {/* Bar Pair */}
              <div className="w-full flex items-end justify-center gap-1 sm:gap-2 h-full">
                {/* Income Bar */}
                <div
                  className="w-1/2 max-w-[24px] bg-emerald-500 hover:bg-emerald-600 rounded-t-lg transition-all duration-300"
                  style={{ height: `${incHeight}%` }}
                />
                {/* Expense Bar */}
                <div
                  className="w-1/2 max-w-[24px] bg-rose-500 hover:bg-rose-600 rounded-t-lg transition-all duration-300"
                  style={{ height: `${expHeight}%` }}
                />
              </div>

              {/* Month label */}
              <span className="mt-2 text-[11px] font-bold text-slate-500 truncate w-full text-center">
                {item.monthLabel.split(' ')[0]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};


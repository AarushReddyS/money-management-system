import React from 'react';

export const BillFilter = ({ statusFilter, setStatusFilter, counts }) => {
  const tabs = [
    { key: '', label: 'All Bills', count: counts.all },
    { key: 'PENDING', label: 'Pending', count: counts.pending },
    { key: 'OVERDUE', label: 'Overdue', count: counts.overdue, alert: counts.overdue > 0 },
    { key: 'PAID', label: 'Paid', count: counts.paid },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 p-1 bg-slate-100 rounded-2xl w-fit">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setStatusFilter(tab.key)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            statusFilter === tab.key
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>{tab.label}</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
              tab.alert
                ? 'bg-rose-100 text-rose-700'
                : statusFilter === tab.key
                ? 'bg-indigo-50 text-indigo-700'
                : 'bg-slate-200 text-slate-600'
            }`}
          >
            {tab.count || 0}
          </span>
        </button>
      ))}
    </div>
  );
};


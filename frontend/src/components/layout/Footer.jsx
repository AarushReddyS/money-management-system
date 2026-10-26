import React from 'react';

export const Footer = () => {
  return (
    <footer className="py-6 px-6 border-t border-slate-200/80 bg-white text-center text-xs text-slate-500">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
        <p>© {new Date().getFullYear()} FinanceFlow Money Management System. All rights reserved.</p>
        <div className="flex items-center gap-4 text-slate-400">
          <span>React + Spring Boot + Aiven MySQL</span>
          <span>•</span>
          <span>Vercel + Render Ready</span>
        </div>
      </div>
    </footer>
  );
};


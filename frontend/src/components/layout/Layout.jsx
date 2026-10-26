import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { IncomeModal } from '../income/IncomeModal';
import { ExpenseModal } from '../expense/ExpenseModal';
import { useToast } from '../../context/ToastContext';

export const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isQuickIncomeOpen, setIsQuickIncomeOpen] = useState(false);
  const [isQuickExpenseOpen, setIsQuickExpenseOpen] = useState(false);
  const { showToast } = useToast();

  const handleIncomeSaved = () => {
    setIsQuickIncomeOpen(false);
    showToast('Income added successfully!');
    // Trigger global event or reload current view
    window.dispatchEvent(new Event('finance-data-updated'));
  };

  const handleExpenseSaved = () => {
    setIsQuickExpenseOpen(false);
    showToast('Expense added successfully!');
    // Trigger global event or reload current view
    window.dispatchEvent(new Event('finance-data-updated'));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col lg:pl-64">
        <Navbar
          onOpenSidebar={() => setSidebarOpen(true)}
          onQuickIncome={() => setIsQuickIncomeOpen(true)}
          onQuickExpense={() => setIsQuickExpenseOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        <Footer />
      </div>

      {/* Quick Add Modals */}
      <IncomeModal
        isOpen={isQuickIncomeOpen}
        onClose={() => setIsQuickIncomeOpen(false)}
        onSaved={handleIncomeSaved}
      />

      <ExpenseModal
        isOpen={isQuickExpenseOpen}
        onClose={() => setIsQuickExpenseOpen(false)}
        onSaved={handleExpenseSaved}
      />
    </div>
  );
};


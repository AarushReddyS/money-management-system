import { CURRENCIES } from './constants';

export const getCurrencySymbol = (currencyCode = 'USD') => {
  const found = CURRENCIES.find(c => c.code === currencyCode);
  return found ? found.symbol : '$';
};

export const formatMoney = (amount, currencyCode = 'USD') => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    amount = 0;
  }
  const symbol = getCurrencySymbol(currencyCode);
  const formatted = Math.abs(Number(amount)).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  return Number(amount) < 0 ? `-${symbol}${formatted}` : `${symbol}${formatted}`;
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const getDaysDifference = (targetDateStr) => {
  if (!targetDateStr) return 0;
  const target = new Date(targetDateStr);
  const today = new Date();
  target.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const diffTime = target.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getDueLabel = (dueDateStr, status) => {
  if (status === 'PAID') return { text: 'Paid', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
  const days = getDaysDifference(dueDateStr);
  if (days < 0) {
    return { text: `Overdue by ${Math.abs(days)} day${Math.abs(days) > 1 ? 's' : ''}`, color: 'text-rose-700 bg-rose-50 border-rose-200' };
  } else if (days === 0) {
    return { text: 'Due today', color: 'text-amber-700 bg-amber-50 border-amber-200' };
  } else if (days === 1) {
    return { text: 'Due tomorrow', color: 'text-amber-700 bg-amber-50 border-amber-200' };
  } else {
    return { text: `Due in ${days} days`, color: 'text-indigo-700 bg-indigo-50 border-indigo-200' };
  }
};


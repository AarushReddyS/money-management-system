import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
      <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mb-6">
        <span className="text-4xl font-black">404</span>
      </div>
      <h2 className="text-2xl font-bold text-slate-800">Page Not Found</h2>
      <p className="mt-2 text-sm text-slate-500 max-w-sm">
        The financial page you are looking for doesn't exist or has moved.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition shadow-sm shadow-indigo-200"
      >
        <Home className="w-4 h-4" />
        <span>Back to Dashboard</span>
      </Link>
    </div>
  );
};


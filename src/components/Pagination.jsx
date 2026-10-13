import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-slate-200 sm:px-6 rounded-b-2xl">
      <div className="flex justify-between flex-1 sm:hidden">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="px-3 py-1 text-sm font-medium border rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
          className="px-3 py-1 text-sm font-medium border rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-xs text-slate-500">
            Page <span className="font-semibold text-slate-800">{currentPage + 1}</span> of{' '}
            <span className="font-semibold text-slate-800">{totalPages}</span>
          </p>
        </div>
        <div>
          <nav className="inline-flex rounded-lg shadow-sm -space-x-px">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="px-2.5 py-1.5 rounded-l-lg border border-slate-300 bg-white text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                onClick={() => onPageChange(idx)}
                className={`px-3 py-1.5 border text-xs font-medium ${
                  currentPage === idx
                    ? 'border-campus-500 bg-campus-50 text-campus-600 font-semibold'
                    : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
              className="px-2.5 py-1.5 rounded-r-lg border border-slate-300 bg-white text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

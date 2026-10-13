import React from 'react';

export const LocationCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm animate-pulse space-y-3">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <div className="h-5 bg-slate-200 rounded-md w-3/4"></div>
          <div className="h-3 bg-slate-200 rounded-md w-1/3"></div>
        </div>
        <div className="w-8 h-8 bg-slate-200 rounded-lg"></div>
      </div>
      <div className="h-3 bg-slate-200 rounded-md w-full"></div>
      <div className="h-3 bg-slate-200 rounded-md w-4/5"></div>
      <div className="pt-2 flex items-center justify-between border-t border-slate-100">
        <div className="h-4 bg-slate-200 rounded-md w-1/4"></div>
        <div className="h-8 bg-slate-200 rounded-lg w-24"></div>
      </div>
    </div>
  );
};

import React from 'react';
import { Compass, Shield, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Compass className="w-5 h-5 text-campus-400" />
          <span className="font-semibold text-white">CampusNav</span>
          <span className="text-slate-500">|</span>
          <span className="text-xs text-slate-400">Smart Campus Navigation &amp; Facility Locator</span>
        </div>

        <div className="flex items-center space-x-6 text-xs">
          <span>Spring Boot 3 + React + Dijkstra + RAG Chatbot</span>
          <span className="text-slate-700">•</span>
          <span>B.Tech CSE Project (EMA3151)</span>
        </div>

        <div className="text-xs text-slate-500">
          Built with care for students &amp; visitors.
        </div>
      </div>
    </footer>
  );
};

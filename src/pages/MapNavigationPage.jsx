import React from 'react';
import { InteractiveCampusMap } from '../components/InteractiveCampusMap';
import { RouteDirectionsPanel } from '../components/RouteDirectionsPanel';
import { NearbyFacilities } from '../components/NearbyFacilities';
import { Sparkles, Compass, Shield, Users } from 'lucide-react';

export const MapNavigationPage = () => {
  return (
    <div className="space-y-8 pb-12">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-campus-950 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-campus-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-campus-500/20 border border-campus-500/30 text-campus-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Smart Campus Wayfinding &amp; Pathfinding Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            Find Any Classroom, Lab or Facility Instantly
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Select any two locations on the campus graph to calculate the shortest step-by-step route using
            Dijkstra's algorithm, check wheelchair accessibility, or ask CampusBot AI for immediate guidance.
          </p>
        </div>
      </div>

      {/* Main Grid: Interactive Map + Directions Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Interactive Map Canvas (7 cols on desktop) */}
        <div className="lg:col-span-8">
          <InteractiveCampusMap />
        </div>

        {/* Route Planner & Step-by-Step Directions (5 cols on desktop) */}
        <div className="lg:col-span-4 h-full">
          <RouteDirectionsPanel />
        </div>
      </div>

      {/* Nearby Facilities Explorer */}
      <NearbyFacilities />
    </div>
  );
};

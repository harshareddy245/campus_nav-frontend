import React, { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { useAuth } from '../context/AuthContext';
import { navigationApi } from '../api/navigationApi';
import { 
  ArrowUpDown, 
  Navigation2, 
  Clock, 
  Footprints, 
  Accessibility, 
  Bookmark, 
  Check, 
  RotateCcw,
  Sparkles,
  MapPin,
  AlertCircle
} from 'lucide-react';

export const RouteDirectionsPanel = () => {
  const { 
    locations, 
    sourceLocation, 
    setSourceLocation, 
    destinationLocation, 
    setDestinationLocation, 
    swapLocations, 
    accessibleOnly, 
    setAccessibleOnly, 
    activeRoute, 
    routeLoading, 
    routeError, 
    calculateRoute, 
    clearRoute 
  } = useNavigation();

  const { isAuthenticated } = useAuth();
  const [saveTitle, setSaveTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleCalculate = () => {
    if (sourceLocation && destinationLocation) {
      calculateRoute(sourceLocation.id, destinationLocation.id, accessibleOnly);
    }
  };

  const handleSaveRoute = async () => {
    if (!activeRoute || !sourceLocation || !destinationLocation) return;
    try {
      setIsSaving(true);
      const title = saveTitle.trim() || `${sourceLocation.name} to ${destinationLocation.name}`;
      await navigationApi.saveRoute(sourceLocation.id, destinationLocation.id, title);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      setSaveTitle('');
    } catch (err) {
      console.error('Failed to save route:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200/80 flex flex-col h-full">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-campus-50 text-campus-600 flex items-center justify-center">
            <Navigation2 className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Route Planner</h3>
        </div>

        {(sourceLocation || destinationLocation || activeRoute) && (
          <button
            onClick={() => {
              setSourceLocation(null);
              setDestinationLocation(null);
              clearRoute();
            }}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center space-x-1 py-1 px-2 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Selectors */}
      <div className="space-y-3 relative mb-4">
        {/* Source selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Start Location
          </label>
          <select
            value={sourceLocation?.id || ''}
            onChange={(e) => {
              const loc = locations.find((l) => l.id === Number(e.target.value));
              setSourceLocation(loc || null);
            }}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-500 transition-all"
          >
            <option value="">Select departure point...</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name} ({loc.code})
              </option>
            ))}
          </select>
        </div>

        {/* Swap button */}
        <div className="flex justify-center -my-1">
          <button
            onClick={swapLocations}
            disabled={!sourceLocation && !destinationLocation}
            className="p-1.5 bg-white border border-slate-200 rounded-full text-slate-500 hover:text-campus-600 hover:border-campus-400 shadow-sm transition-all disabled:opacity-40"
            title="Swap locations"
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>

        {/* Destination selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            Destination
          </label>
          <select
            value={destinationLocation?.id || ''}
            onChange={(e) => {
              const loc = locations.find((l) => l.id === Number(e.target.value));
              setDestinationLocation(loc || null);
            }}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-500 transition-all"
          >
            <option value="">Select destination...</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name} ({loc.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Accessibility Option */}
      <div className="flex items-center justify-between py-2.5 px-3.5 bg-slate-50 rounded-xl border border-slate-200/80 mb-4">
        <label htmlFor="accessible-toggle" className="flex items-center space-x-2 text-xs font-medium text-slate-700 cursor-pointer">
          <Accessibility className="w-4 h-4 text-campus-600" />
          <span>Wheelchair Accessible (Step-Free)</span>
        </label>
        <input
          id="accessible-toggle"
          type="checkbox"
          checked={accessibleOnly}
          onChange={(e) => {
            setAccessibleOnly(e.target.checked);
            if (sourceLocation && destinationLocation) {
              calculateRoute(sourceLocation.id, destinationLocation.id, e.target.checked);
            }
          }}
          className="w-4 h-4 text-campus-600 rounded border-slate-300 focus:ring-campus-500 cursor-pointer"
        />
      </div>

      {/* Action Button */}
      <button
        onClick={handleCalculate}
        disabled={!sourceLocation || !destinationLocation || routeLoading}
        className="w-full py-3 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-campus-600 to-campus-700 text-white shadow-md shadow-campus-600/20 hover:from-campus-700 hover:to-campus-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {routeLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Calculating Shortest Route...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            <span>Find Shortest Route</span>
          </>
        )}
      </button>

      {/* Error Message */}
      {routeError && (
        <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
          <span>{routeError}</span>
        </div>
      )}

      {/* Route Results & Steps */}
      {activeRoute && (
        <div className="mt-5 flex-1 flex flex-col overflow-hidden">
          {/* Metrics header */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-campus-50/80 p-3 rounded-2xl border border-campus-100 flex items-center space-x-3">
              <Footprints className="w-5 h-5 text-campus-600" />
              <div>
                <span className="text-[10px] uppercase font-bold text-campus-700">Distance</span>
                <p className="text-base font-extrabold text-slate-900 leading-none mt-0.5">
                  {Math.round(activeRoute.totalDistanceMeters)} m
                </p>
              </div>
            </div>

            <div className="bg-amber-50/80 p-3 rounded-2xl border border-amber-100 flex items-center space-x-3">
              <Clock className="w-5 h-5 text-amber-600" />
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-700">Walk Time</span>
                <p className="text-base font-extrabold text-slate-900 leading-none mt-0.5">
                  ~{activeRoute.estimatedWalkingMinutes} min
                </p>
              </div>
            </div>
          </div>

          {/* Turn-by-turn Steps */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 max-h-56">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Step-by-Step Directions ({activeRoute.steps.length} waypoints)
            </span>
            {activeRoute.steps.map((step) => (
              <div
                key={step.stepNumber}
                className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/70 text-xs transition-colors flex items-start space-x-3"
              >
                <span className="w-5 h-5 rounded-full bg-campus-100 text-campus-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                  {step.stepNumber}
                </span>
                <div className="flex-1">
                  <p className="font-semibold text-slate-800">{step.instruction}</p>
                  <div className="flex items-center space-x-2 text-[10px] text-slate-500 mt-1">
                    <span>{Math.round(step.distanceMeters)}m</span>
                    <span>•</span>
                    <span className="uppercase font-medium">{step.pathType}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Save Route Button */}
          {isAuthenticated && (
            <div className="pt-4 border-t border-slate-100 mt-3">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Custom name (e.g. My Morning Walk)"
                  value={saveTitle}
                  onChange={(e) => setSaveTitle(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-campus-500"
                />
                <button
                  onClick={handleSaveRoute}
                  disabled={isSaving}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors shrink-0"
                >
                  {saveSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Saved!</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>Save Route</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

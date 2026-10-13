import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { navigationApi } from '../api/navigationApi';
import { useNavigation } from '../context/NavigationContext';
import { 
  Bookmark, 
  Trash2, 
  Navigation, 
  Clock, 
  Footprints, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const SavedRoutesPage = () => {
  const navigate = useNavigate();
  const { setSourceLocation, setDestinationLocation, calculateRoute } = useNavigation();

  const [savedRoutes, setSavedRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      const data = await navigationApi.getSavedRoutes();
      setSavedRoutes(data);
    } catch (err) {
      console.error('Failed to load saved routes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this saved route?')) {
      try {
        await navigationApi.deleteSavedRoute(id);
        setSavedRoutes((prev) => prev.filter((r) => r.id !== id));
      } catch (err) {
        console.error('Failed to delete saved route:', err);
      }
    }
  };

  const handleOpenOnMap = (route) => {
    setSourceLocation(route.sourceLocation);
    setDestinationLocation(route.destinationLocation);
    calculateRoute(route.sourceLocation.id, route.destinationLocation.id);
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            My Saved Routes
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Quickly re-open your daily classes, laboratory walks, and favorite campus paths.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-white rounded-2xl border border-slate-200 animate-pulse"></div>
          ))}
        </div>
      ) : savedRoutes.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
          <Bookmark className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No saved routes yet</h3>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            Plan a journey on the interactive map and click "Save Route" to pin it here.
          </p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-campus-600 text-white rounded-xl text-xs font-semibold hover:bg-campus-700 transition-colors"
          >
            <Navigation className="w-4 h-4" />
            <span>Go to Map Planner</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {savedRoutes.map((route) => (
            <div
              key={route.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <span className="text-xs font-bold text-campus-700 bg-campus-50 px-2.5 py-0.5 rounded-md">
                  {route.title}
                </span>

                <div className="flex items-center space-x-2 text-sm font-semibold text-slate-900 pt-1">
                  <span>{route.sourceLocation.name}</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{route.destinationLocation.name}</span>
                </div>

                <div className="flex items-center space-x-4 text-xs text-slate-500 pt-1">
                  <span className="flex items-center space-x-1">
                    <Footprints className="w-3.5 h-3.5 text-campus-600" />
                    <span>{Math.round(route.totalDistanceMeters)} meters</span>
                  </span>
                  <span>•</span>
                  <span>Saved on {new Date(route.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                <button
                  onClick={() => handleOpenOnMap(route)}
                  className="px-3.5 py-2 bg-campus-600 hover:bg-campus-700 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-sm"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>View on Map</span>
                </button>
                <button
                  onClick={() => handleDelete(route.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  title="Delete route"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

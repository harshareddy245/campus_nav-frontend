import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { locationApi } from '../api/locationApi';
import { useNavigation } from '../context/NavigationContext';
import { Pagination } from '../components/Pagination';
import { LocationCardSkeleton } from '../components/LoadingSkeleton';
import { 
  Search, 
  MapPin, 
  Building2, 
  Navigation, 
  Clock, 
  User, 
  Check, 
  SlidersHorizontal,
  Layers
} from 'lucide-react';

export const ExplorePage = () => {
  const navigate = useNavigate();
  const { setDestinationLocation } = useNavigation();

  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 8;

  const categories = [
    { id: '', label: 'All Categories' },
    { id: 'CLASSROOM', label: 'Classrooms' },
    { id: 'LAB', label: 'Labs & Computing' },
    { id: 'LIBRARY', label: 'Libraries' },
    { id: 'OFFICE', label: 'Administrative Offices' },
    { id: 'CAFETERIA', label: 'Food & Dining' },
    { id: 'AUDITORIUM', label: 'Auditoriums' },
  ];

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        const data = await locationApi.getAllLocations({
          page,
          size: pageSize,
          category: selectedCategory || undefined,
          query: searchQuery || undefined,
        });

        if (data.content) {
          setLocations(data.content);
          setTotalPages(data.totalPages);
        } else {
          setLocations(Array.isArray(data) ? data : []);
          setTotalPages(1);
        }
      } catch (err) {
        console.error('Failed to load locations:', err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchLocations, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, page]);

  const handleNavigate = (loc) => {
    setDestinationLocation(loc);
    navigate('/');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Campus Directory &amp; Locations
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Search and browse all lecture halls, research laboratories, academic departments, and services.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-slate-200/80 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(0);
              }}
              placeholder="Search by name, room code (e.g. LAB-301), or description..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-500 transition-all"
            />
          </div>

          {/* Category Dropdown */}
          <div className="sm:w-64">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(0);
              }}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-700 focus:outline-none focus:border-campus-500"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Locations */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(pageSize)].map((_, i) => (
            <LocationCardSkeleton key={i} />
          ))}
        </div>
      ) : locations.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
          <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No matching campus locations</h3>
          <p className="text-xs text-slate-500 mt-1">Try adjusting your search criteria or category filter.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-5">
            {locations.map((loc) => (
              <div
                key={loc.id}
                className="bg-slate-50/70 hover:bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-campus-300 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-campus-700 bg-campus-100 px-2 py-0.5 rounded-full">
                      {loc.category}
                    </span>
                    <span className="text-xs font-mono font-semibold text-slate-500">
                      {loc.code}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-campus-600 transition-colors mb-1.5">
                    {loc.name}
                  </h3>

                  <div className="flex items-center space-x-1.5 text-xs text-slate-600 mb-2">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{loc.buildingName || 'Academic Block'} • {loc.floor === 0 ? 'Ground' : `Floor ${loc.floor}`}</span>
                  </div>

                  {loc.description && (
                    <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                      {loc.description}
                    </p>
                  )}

                  {/* Facilities badges */}
                  {loc.facilities && loc.facilities.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {loc.facilities.map((fac, idx) => (
                        <span key={idx} className="text-[9px] font-medium bg-white text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                          {fac}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    {loc.operatingHours || 'Standard Hours'}
                  </span>
                  <button
                    onClick={() => handleNavigate(loc)}
                    className="px-3 py-1.5 bg-campus-600 group-hover:bg-campus-700 text-white rounded-xl text-xs font-semibold flex items-center space-x-1 transition-colors shadow-sm"
                  >
                    <Navigation className="w-3 h-3" />
                    <span>Navigate</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      )}
    </div>
  );
};

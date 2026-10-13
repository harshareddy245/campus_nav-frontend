import React, { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { 
  Droplet, 
  Bath, 
  ArrowUpDown, 
  Coffee, 
  CreditCard, 
  Cross, 
  Wifi, 
  Navigation,
  MapPin
} from 'lucide-react';

export const NearbyFacilities = () => {
  const { locations, setDestinationLocation, sourceLocation, calculateRoute } = useNavigation();
  const [selectedFacility, setSelectedFacility] = useState('Drinking Water Purifier');

  const facilityOptions = [
    { name: 'Drinking Water Purifier', label: 'Water', icon: Droplet, color: 'text-sky-500 bg-sky-50 border-sky-200' },
    { name: 'Restroom', label: 'Restrooms', icon: Bath, color: 'text-violet-500 bg-violet-50 border-violet-200' },
    { name: 'Elevator / Lift', label: 'Elevators', icon: ArrowUpDown, color: 'text-amber-500 bg-amber-50 border-amber-200' },
    { name: 'Snack Kiosk', label: 'Cafeteria & Snacks', icon: Coffee, color: 'text-orange-500 bg-orange-50 border-orange-200' },
    { name: 'First Aid Post', label: 'Health & First Aid', icon: Cross, color: 'text-rose-500 bg-rose-50 border-rose-200' },
    { name: 'Campus ATM', label: 'ATM', icon: CreditCard, color: 'text-emerald-500 bg-emerald-50 border-emerald-200' },
  ];

  // Locations that offer the selected facility
  const matchedLocations = locations.filter((loc) =>
    loc.facilities?.some((f) => f.toLowerCase().includes(selectedFacility.toLowerCase()))
  );

  const handleNavigateTo = (loc) => {
    setDestinationLocation(loc);
    if (sourceLocation) {
      calculateRoute(sourceLocation.id, loc.id);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200/80">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-slate-900 text-base">Nearby Facilities &amp; Amenities</h3>
          <p className="text-xs text-slate-500">Find essential utilities across all academic blocks</p>
        </div>
      </div>

      {/* Facility selector pills */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-5">
        {facilityOptions.map((fac) => {
          const IconComponent = fac.icon;
          const isSelected = selectedFacility === fac.name;
          return (
            <button
              key={fac.name}
              onClick={() => setSelectedFacility(fac.name)}
              className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-center space-y-1.5 transition-all ${
                isSelected
                  ? 'border-campus-500 bg-campus-50 ring-2 ring-campus-500/20 shadow-sm'
                  : 'border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50'
              }`}
            >
              <div className={`p-2 rounded-xl ${fac.color}`}>
                <IconComponent className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-semibold text-slate-800 leading-tight">
                {fac.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Available points */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {matchedLocations.slice(0, 6).map((loc) => (
          <div
            key={loc.id}
            className="p-3.5 bg-slate-50/80 hover:bg-slate-100/80 rounded-2xl border border-slate-200/70 transition-all flex items-center justify-between"
          >
            <div className="pr-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {loc.buildingName || 'Campus'} • Floor {loc.floor}
              </span>
              <h4 className="text-xs font-bold text-slate-900 leading-snug">{loc.name}</h4>
              <span className="text-[10px] text-slate-500">Code: {loc.code}</span>
            </div>

            <button
              onClick={() => handleNavigateTo(loc)}
              className="p-2 bg-white hover:bg-campus-500 hover:text-white text-slate-700 border border-slate-200 hover:border-campus-500 rounded-xl shadow-sm text-xs font-semibold flex items-center space-x-1 transition-all shrink-0"
              title="Set as destination"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span className="text-[11px]">Go</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

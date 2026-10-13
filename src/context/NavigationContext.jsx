import React, { createContext, useContext, useState, useEffect } from 'react';
import { locationApi } from '../api/locationApi';
import { navigationApi } from '../api/navigationApi';

const NavigationContext = createContext(null);

export const NavigationProvider = ({ children }) => {
  const [locations, setLocations] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);

  const [sourceLocation, setSourceLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [accessibleOnly, setAccessibleOnly] = useState(false);
  const [activeRoute, setActiveRoute] = useState(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [locs, blds, facs] = await Promise.all([
        locationApi.getAllLocations(),
        locationApi.getBuildings(),
        locationApi.getFacilities(),
      ]);
      setLocations(locs);
      setBuildings(blds);
      setFacilities(facs);
    } catch (err) {
      console.error('Failed to load campus data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const calculateRoute = async (srcId, destId, isAccessible = accessibleOnly) => {
    if (!srcId || !destId) return;
    try {
      setRouteLoading(true);
      setRouteError(null);
      const route = await navigationApi.calculateRoute(srcId, destId, isAccessible);
      setActiveRoute(route);
      return route;
    } catch (err) {
      const msg = err.response?.data?.message || 'Unable to calculate route between chosen points.';
      setRouteError(msg);
      setActiveRoute(null);
      throw err;
    } finally {
      setRouteLoading(false);
    }
  };

  const swapLocations = () => {
    const temp = sourceLocation;
    setSourceLocation(destinationLocation);
    setDestinationLocation(temp);
    if (destinationLocation && temp) {
      calculateRoute(destinationLocation.id, temp.id, accessibleOnly);
    }
  };

  const clearRoute = () => {
    setActiveRoute(null);
    setRouteError(null);
  };

  return (
    <NavigationContext.Provider
      value={{
        locations,
        buildings,
        facilities,
        loading,
        sourceLocation,
        setSourceLocation,
        destinationLocation,
        setDestinationLocation,
        accessibleOnly,
        setAccessibleOnly,
        activeRoute,
        setActiveRoute,
        routeLoading,
        routeError,
        calculateRoute,
        swapLocations,
        clearRoute,
        refreshData: loadData,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

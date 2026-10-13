import React, { useState, useEffect } from 'react';
import { adminApi } from '../api/adminApi';
import { locationApi } from '../api/locationApi';
import { navigationApi } from '../api/navigationApi';
import { useNavigation } from '../context/NavigationContext';
import { 
  Building2, 
  MapPin, 
  Route, 
  Activity, 
  Users, 
  Plus, 
  Pencil, 
  Trash2, 
  Check, 
  X, 
  AlertCircle,
  Accessibility
} from 'lucide-react';

export const AdminDashboardPage = () => {
  const { refreshData } = useNavigation();

  const [activeTab, setActiveTab] = useState('locations');
  const [locations, setLocations] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [connections, setConnections] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [showConnectionModal, setShowConnectionModal] = useState(false);

  // Location form state
  const [locForm, setLocForm] = useState({
    name: '',
    code: '',
    category: 'CLASSROOM',
    floor: 0,
    mapX: 300,
    mapY: 300,
    description: '',
    operatingHours: '8:00 AM - 6:00 PM',
    contactPerson: '',
    buildingId: '',
    isWheelchairAccessible: true,
  });

  // Connection form state
  const [connForm, setConnForm] = useState({
    fromLocationId: '',
    toLocationId: '',
    distanceMeters: 50,
    walkingTimeSeconds: 40,
    pathType: 'WALKWAY',
    isWheelchairAccessible: true,
    directionsText: '',
    bidirectional: true,
  });

  const loadAll = async () => {
    try {
      setLoading(true);
      const [locs, blds, conns, logs, usrList] = await Promise.all([
        locationApi.getAllLocations(),
        locationApi.getBuildings(),
        navigationApi.getAllConnections(),
        adminApi.getAuditLogs(),
        adminApi.getUsers(),
      ]);
      setLocations(locs);
      setBuildings(blds);
      setConnections(conns);
      setAuditLogs(logs);
      setUsers(usrList);
      if (blds.length > 0 && !locForm.buildingId) {
        setLocForm((prev) => ({ ...prev, buildingId: blds[0].id }));
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  // Save / Update Location
  const handleSaveLocation = async (e) => {
    e.preventDefault();
    try {
      if (editingLocation) {
        await adminApi.updateLocation(editingLocation.id, locForm);
      } else {
        await adminApi.createLocation(locForm);
      }
      setShowLocationModal(false);
      setEditingLocation(null);
      loadAll();
      refreshData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save location');
    }
  };

  // Delete Location
  const handleDeleteLocation = async (id) => {
    if (window.confirm('Delete this location and its associated pathways?')) {
      try {
        await adminApi.deleteLocation(id);
        loadAll();
        refreshData();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete');
      }
    }
  };

  // Save Connection
  const handleSaveConnection = async (e) => {
    e.preventDefault();
    try {
      await adminApi.createConnection(connForm);
      setShowConnectionModal(false);
      loadAll();
      refreshData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create connection');
    }
  };

  // Delete Connection
  const handleDeleteConnection = async (id) => {
    if (window.confirm('Remove this pathway connection?')) {
      try {
        await adminApi.deleteConnection(id);
        loadAll();
        refreshData();
      } catch (err) {
        alert('Failed to remove connection');
      }
    }
  };

  const openEditModal = (loc) => {
    setEditingLocation(loc);
    setLocForm({
      name: loc.name,
      code: loc.code,
      category: loc.category,
      floor: loc.floor,
      mapX: loc.mapX,
      mapY: loc.mapY,
      description: loc.description || '',
      operatingHours: loc.operatingHours || '',
      contactPerson: loc.contactPerson || '',
      buildingId: loc.buildingId || buildings[0]?.id,
      isWheelchairAccessible: loc.isWheelchairAccessible,
    });
    setShowLocationModal(true);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Campus Administration Console
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Manage nodes, classrooms, pathways, audit search logs, and manage user access.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {activeTab === 'locations' && (
            <button
              onClick={() => {
                setEditingLocation(null);
                setLocForm({
                  name: '',
                  code: '',
                  category: 'CLASSROOM',
                  floor: 0,
                  mapX: 400,
                  mapY: 300,
                  description: '',
                  operatingHours: '8:00 AM - 6:00 PM',
                  contactPerson: '',
                  buildingId: buildings[0]?.id || '',
                  isWheelchairAccessible: true,
                });
                setShowLocationModal(true);
              }}
              className="px-4 py-2 bg-campus-600 hover:bg-campus-700 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Location</span>
            </button>
          )}

          {activeTab === 'connections' && (
            <button
              onClick={() => {
                if (locations.length >= 2) {
                  setConnForm({
                    fromLocationId: locations[0].id,
                    toLocationId: locations[1].id,
                    distanceMeters: 45,
                    walkingTimeSeconds: 35,
                    pathType: 'WALKWAY',
                    isWheelchairAccessible: true,
                    directionsText: 'Walk along covered corridor',
                    bidirectional: true,
                  });
                }
                setShowConnectionModal(true);
              }}
              className="px-4 py-2 bg-campus-600 hover:bg-campus-700 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Pathway</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200">
        {[
          { id: 'locations', label: 'Locations & Rooms', icon: MapPin },
          { id: 'connections', label: 'Pathway Connections', icon: Route },
          { id: 'audit', label: 'Async Search Logs', icon: Activity },
          { id: 'users', label: 'Users & Roles', icon: Users },
        ].map((tab) => {
          const IconComp = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 px-3 text-xs font-bold flex items-center space-x-2 border-b-2 transition-all ${
                isActive
                  ? 'border-campus-600 text-campus-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <IconComp className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Locations Table */}
      {activeTab === 'locations' && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3">Location Name</th>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Building / Floor</th>
                  <th className="px-4 py-3">Map Coordinates</th>
                  <th className="px-4 py-3">Accessible</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {locations.map((loc) => (
                  <tr key={loc.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-slate-900">
                      {loc.name}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-campus-700 font-semibold">
                      {loc.code}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        {loc.category}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      {loc.buildingName || 'Building'} (Floor {loc.floor})
                    </td>
                    <td className="px-4 py-3.5 font-mono text-slate-500">
                      X: {loc.mapX}, Y: {loc.mapY}
                    </td>
                    <td className="px-4 py-3.5">
                      {loc.isWheelchairAccessible ? (
                        <span className="text-emerald-600 font-semibold flex items-center space-x-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>Yes</span>
                        </span>
                      ) : (
                        <span className="text-slate-400">No</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(loc)}
                        className="p-1.5 text-slate-500 hover:text-campus-600 hover:bg-campus-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteLocation(loc.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Pathway Connections Table */}
      {activeTab === 'connections' && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3">From Location</th>
                  <th className="px-5 py-3">To Location</th>
                  <th className="px-4 py-3">Distance</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-5 py-3">Directions Text</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {connections.map((conn) => (
                  <tr key={conn.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-3 font-semibold text-slate-900">
                      {conn.fromLocationName}
                    </td>
                    <td className="px-5 py-3 font-semibold text-slate-900">
                      {conn.toLocationName}
                    </td>
                    <td className="px-4 py-3 font-mono">
                      {Math.round(conn.distanceMeters)}m (~{conn.walkingTimeSeconds}s)
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                        {conn.pathType}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-500 line-clamp-1">
                      {conn.directionsText || 'Standard pathway'}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => handleDeleteConnection(conn.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Async Audit Logs */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-campus-600" />
              <span className="font-bold text-xs text-slate-800">
                Async Route Search Queries &amp; Performance Telemetry
              </span>
            </div>
            <span className="text-[11px] text-slate-500">
              Powered by Spring @Async &amp; Logback Structured Logging
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3">Timestamp</th>
                  <th className="px-5 py-3">Search Query (Origin &rarr; Destination)</th>
                  <th className="px-4 py-3">Calculated Distance</th>
                  <th className="px-4 py-3">Execution Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70">
                    <td className="px-5 py-3 text-slate-500">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="px-5 py-3 font-sans font-semibold text-slate-800">
                      {log.sourceName} &rarr; {log.destinationName}
                    </td>
                    <td className="px-4 py-3 text-campus-600">
                      {Math.round(log.routeDistanceMeters)} meters
                    </td>
                    <td className="px-4 py-3 text-emerald-600 font-bold">
                      {log.executionTimeMs} ms
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Users List */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3">Full Name</th>
                  <th className="px-4 py-3">Username</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/70">
                    <td className="px-5 py-3.5 font-bold text-slate-900">
                      {u.fullName}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-slate-600">{u.username}</td>
                    <td className="px-4 py-3.5 text-slate-600">{u.email}</td>
                    <td className="px-4 py-3.5">{u.department || 'N/A'}</td>
                    <td className="px-4 py-3.5">
                      {Array.from(u.roles).map((r, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-campus-50 text-campus-700 mr-1">
                          {r.replace('ROLE_', '')}
                        </span>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Location Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-base text-slate-900">
                {editingLocation ? 'Edit Campus Location' : 'Add New Campus Location'}
              </h3>
              <button
                onClick={() => setShowLocationModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLocation} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Location Name</label>
                <input
                  type="text"
                  required
                  value={locForm.name}
                  onChange={(e) => setLocForm({ ...locForm, name: e.target.value })}
                  placeholder="e.g. Advanced Java Lab"
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Code</label>
                  <input
                    type="text"
                    required
                    disabled={!!editingLocation}
                    value={locForm.code}
                    onChange={(e) => setLocForm({ ...locForm, code: e.target.value })}
                    placeholder="e.g. LAB-301"
                    className="w-full px-3 py-2 border rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={locForm.category}
                    onChange={(e) => setLocForm({ ...locForm, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    <option value="CLASSROOM">CLASSROOM</option>
                    <option value="LAB">LAB</option>
                    <option value="LIBRARY">LIBRARY</option>
                    <option value="OFFICE">OFFICE</option>
                    <option value="CAFETERIA">CAFETERIA</option>
                    <option value="AUDITORIUM">AUDITORIUM</option>
                    <option value="GATE">GATE</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Building</label>
                  <select
                    value={locForm.buildingId}
                    onChange={(e) => setLocForm({ ...locForm, buildingId: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    {buildings.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Floor Level</label>
                  <input
                    type="number"
                    min="0"
                    max="6"
                    value={locForm.floor}
                    onChange={(e) => setLocForm({ ...locForm, floor: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Map X Coordinate (0-850)</label>
                  <input
                    type="number"
                    value={locForm.mapX}
                    onChange={(e) => setLocForm({ ...locForm, mapX: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Map Y Coordinate (0-650)</label>
                  <input
                    type="number"
                    value={locForm.mapY}
                    onChange={(e) => setLocForm({ ...locForm, mapY: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows="2"
                  value={locForm.description}
                  onChange={(e) => setLocForm({ ...locForm, description: e.target.value })}
                  placeholder="Details, facilities, lab in-charge..."
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  id="acc-chk"
                  type="checkbox"
                  checked={locForm.isWheelchairAccessible}
                  onChange={(e) => setLocForm({ ...locForm, isWheelchairAccessible: e.target.checked })}
                  className="rounded text-campus-600"
                />
                <label htmlFor="acc-chk" className="font-semibold text-slate-700">
                  Wheelchair Accessible
                </label>
              </div>

              <div className="pt-4 border-t flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowLocationModal(false)}
                  className="px-4 py-2 border rounded-xl text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-campus-600 text-white rounded-xl font-semibold hover:bg-campus-700"
                >
                  Save Location
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Connection Modal */}
      {showConnectionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-base text-slate-900">Add Pathway Connection</h3>
              <button
                onClick={() => setShowConnectionModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveConnection} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">From Location</label>
                <select
                  value={connForm.fromLocationId}
                  onChange={(e) => setConnForm({ ...connForm, fromLocationId: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-xl"
                >
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name} ({loc.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">To Location</label>
                <select
                  value={connForm.toLocationId}
                  onChange={(e) => setConnForm({ ...connForm, toLocationId: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-xl"
                >
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name} ({loc.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Distance (meters)</label>
                  <input
                    type="number"
                    required
                    value={connForm.distanceMeters}
                    onChange={(e) => setConnForm({ ...connForm, distanceMeters: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pathway Type</label>
                  <select
                    value={connForm.pathType}
                    onChange={(e) => setConnForm({ ...connForm, pathType: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    <option value="WALKWAY">WALKWAY</option>
                    <option value="CORRIDOR">CORRIDOR</option>
                    <option value="ELEVATOR">ELEVATOR</option>
                    <option value="STAIRS">STAIRS</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Directions Text</label>
                <input
                  type="text"
                  value={connForm.directionsText}
                  onChange={(e) => setConnForm({ ...connForm, directionsText: e.target.value })}
                  placeholder="e.g. Walk down the left corridor past Room 102"
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="pt-4 border-t flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowConnectionModal(false)}
                  className="px-4 py-2 border rounded-xl text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-campus-600 text-white rounded-xl font-semibold hover:bg-campus-700"
                >
                  Create Connection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

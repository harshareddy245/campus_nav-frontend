import React, { useState, useRef } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  MapPin, 
  Layers, 
  Navigation,
  Info,
  CheckCircle2
} from 'lucide-react';

export const InteractiveCampusMap = ({ onSelectNode }) => {
  const { 
    locations, 
    buildings, 
    sourceLocation, 
    destinationLocation, 
    setSourceLocation, 
    setDestinationLocation, 
    activeRoute,
    calculateRoute
  } = useNavigation();

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('ALL');

  // Handle Zoom
  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 2.2));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 0.7));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Drag / Pan Map
  const handleMouseDown = (e) => {
    if (e.target.tagName === 'svg' || e.target.id === 'map-background') {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  // Filter locations
  const filteredLocations = locations.filter((loc) => {
    if (selectedFilter === 'ALL') return true;
    return loc.category === selectedFilter;
  });

  // Calculate active path polyline coordinates
  const activePathCoordinates = React.useMemo(() => {
    if (!activeRoute?.pathNodeIds || activeRoute.pathNodeIds.length < 2) return '';
    const nodeMap = new Map(locations.map((loc) => [loc.id, loc]));
    return activeRoute.pathNodeIds
      .map((id) => nodeMap.get(id))
      .filter(Boolean)
      .map((node) => `${node.mapX},${node.mapY}`)
      .join(' ');
  }, [activeRoute, locations]);

  const handleNodeClick = (loc) => {
    if (!sourceLocation) {
      setSourceLocation(loc);
    } else if (!destinationLocation && sourceLocation.id !== loc.id) {
      setDestinationLocation(loc);
      calculateRoute(sourceLocation.id, loc.id);
    } else if (sourceLocation.id === loc.id) {
      setSourceLocation(null);
    } else {
      setDestinationLocation(loc);
      calculateRoute(sourceLocation.id, loc.id);
    }

    if (onSelectNode) {
      onSelectNode(loc);
    }
  };

  const getNodeColor = (category, isStart, isEnd) => {
    if (isStart) return '#10b981'; // Green
    if (isEnd) return '#f43f5e';   // Rose / Red
    switch (category) {
      case 'LAB': return '#0284c7';       // Sky Blue
      case 'CLASSROOM': return '#059669'; // Emerald
      case 'LIBRARY': return '#7c3aed';   // Purple
      case 'OFFICE': return '#d97706';    // Amber
      case 'CAFETERIA': return '#ea580c'; // Orange
      case 'GATE': return '#4f46e5';      // Indigo
      case 'AUDITORIUM': return '#db2777';// Pink
      default: return '#64748b';          // Slate
    }
  };

  return (
    <div className="relative w-full h-[620px] bg-slate-900 rounded-3xl overflow-hidden shadow-xl border border-slate-800 select-none">
      {/* Top Map Action Bar */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2">
        <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 text-xs font-medium text-slate-300 flex items-center gap-2 shadow-lg">
          <Layers className="w-3.5 h-3.5 text-campus-400" />
          <span>Campus Map Viewer</span>
        </div>

        {/* Filter Badges */}
        <div className="hidden sm:flex items-center gap-1 bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-700/80 shadow-lg text-xs">
          {['ALL', 'LAB', 'CLASSROOM', 'LIBRARY', 'CAFETERIA'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                selectedFilter === cat
                  ? 'bg-campus-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat === 'ALL' ? 'All Points' : cat.charAt(0) + cat.slice(1).toLowerCase() + 's'}
            </button>
          ))}
        </div>
      </div>

      {/* Map Zoom / Reset Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5 bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-700/80 shadow-lg">
        <button
          onClick={handleZoomIn}
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleReset}
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          title="Reset View"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 z-20 hidden md:flex items-center gap-4 bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700/80 text-[11px] text-slate-300 shadow-lg">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-500/30"></span>
          <span>Start Point</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-rose-500/30"></span>
          <span>Destination</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-1 bg-cyan-400 rounded-full"></span>
          <span>Shortest Route</span>
        </div>
      </div>

      {/* SVG Canvas Map */}
      <svg
        id="map-canvas"
        viewBox="0 0 850 650"
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <g
          transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}
          style={{ transformOrigin: '425px 325px', transition: isDragging ? 'none' : 'transform 0.15s ease-out' }}
        >
          {/* Ground Pattern */}
          <rect id="map-background" x="0" y="0" width="850" height="650" fill="#0f172a" />

          {/* Stylized Quadrangle Lawn */}
          <rect x="360" y="270" width="180" height="130" rx="16" fill="#13271f" stroke="#1b3f30" strokeWidth="1.5" />
          <text x="450" y="335" textAnchor="middle" fill="#2d6a4f" fontSize="11" fontWeight="600" letterSpacing="2">
            CAMPUS CENTRAL QUAD
          </text>

          {/* Campus Buildings Outlines */}
          {buildings.map((bld) => (
            <g key={bld.id}>
              <rect
                x={bld.mapX - 10}
                y={bld.mapY - 10}
                width={bld.width + 20}
                height={bld.height + 20}
                rx="14"
                fill="#1e293b"
                stroke="#334155"
                strokeWidth="1.5"
                className="transition-all hover:stroke-campus-500/60"
              />
              <rect
                x={bld.mapX - 6}
                y={bld.mapY - 6}
                width={bld.width + 12}
                height={26}
                rx="8"
                fill="#0f172a"
              />
              <text
                x={bld.mapX + bld.width / 2}
                y={bld.mapY + 11}
                textAnchor="middle"
                fill="#94a3b8"
                fontSize="10"
                fontWeight="700"
                letterSpacing="1"
              >
                {bld.code}
              </text>
              <text
                x={bld.mapX + bld.width / 2}
                y={bld.mapY + bld.height / 2 + 10}
                textAnchor="middle"
                fill="#cbd5e1"
                fontSize="11"
                fontWeight="600"
                className="pointer-events-none"
              >
                {bld.name.split('-')[0]}
              </text>
            </g>
          ))}

          {/* Dotted General Pathway Network */}
          <g stroke="#334155" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.6">
            <line x1="100" y1="560" x2="140" y2="420" />
            <line x1="140" y1="420" x2="300" y2="410" />
            <line x1="300" y1="410" x2="450" y2="340" />
            <line x1="450" y1="340" x2="450" y2="480" />
            <line x1="450" y1="340" x2="600" y2="420" />
            <line x1="450" y1="340" x2="660" y2="240" />
            <line x1="450" y1="340" x2="450" y2="130" />
            <line x1="300" y1="410" x2="270" y2="340" />
            <line x1="270" y1="340" x2="270" y2="240" />
            <line x1="270" y1="240" x2="350" y2="240" />
            <line x1="350" y1="240" x2="350" y2="340" />
            <line x1="600" y1="420" x2="600" y2="340" />
            <line x1="660" y1="240" x2="720" y2="200" />
          </g>

          {/* Highlighted Shortest Route Polyline (Dijkstra) */}
          {activePathCoordinates && (
            <g>
              {/* Outer Glow */}
              <polyline
                points={activePathCoordinates}
                fill="none"
                stroke="#06b6d4"
                strokeWidth="10"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.3"
              />
              {/* Animated Core Path */}
              <polyline
                points={activePathCoordinates}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="8,6"
                className="animate-pulse"
              />
            </g>
          )}

          {/* Location Nodes / Pins */}
          {filteredLocations.map((loc) => {
            const isStart = sourceLocation?.id === loc.id;
            const isEnd = destinationLocation?.id === loc.id;
            const isHovered = hoveredNode?.id === loc.id;
            const pinColor = getNodeColor(loc.category, isStart, isEnd);

            return (
              <g
                key={loc.id}
                transform={`translate(${loc.mapX}, ${loc.mapY})`}
                className="cursor-pointer transition-transform"
                onClick={() => handleNodeClick(loc)}
                onMouseEnter={() => setHoveredNode(loc)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* Ping animation for start/end points */}
                {(isStart || isEnd) && (
                  <circle
                    r="16"
                    fill={pinColor}
                    opacity="0.3"
                    className="animate-ping"
                  />
                )}

                {/* Node Outer Ring */}
                <circle
                  r={isStart || isEnd || isHovered ? '11' : '8'}
                  fill={pinColor}
                  stroke="#0f172a"
                  strokeWidth="2.5"
                  className="transition-all"
                />

                {/* Node Center Dot */}
                <circle
                  r="3.5"
                  fill="#ffffff"
                />

                {/* Node Label */}
                <text
                  y={isStart || isEnd ? '-16' : '-12'}
                  textAnchor="middle"
                  fill={isStart || isEnd ? '#ffffff' : '#cbd5e1'}
                  fontSize={isStart || isEnd ? '11' : '9.5'}
                  fontWeight={isStart || isEnd ? '700' : '500'}
                  className="pointer-events-none drop-shadow"
                >
                  {isStart ? '🚩 START: ' + loc.name : isEnd ? '🏁 DEST: ' + loc.name : loc.name}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Floating Node Details Card on Hover */}
      {hoveredNode && (
        <div className="absolute bottom-4 right-4 z-30 max-w-xs bg-slate-900/95 backdrop-blur-md p-4 rounded-2xl border border-slate-700 shadow-2xl text-left pointer-events-none animate-fadeIn">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-campus-400 bg-campus-500/10 px-2 py-0.5 rounded-full">
              {hoveredNode.category}
            </span>
            <span className="text-xs text-slate-400">
              {hoveredNode.floor === 0 ? 'Ground Floor' : `Floor ${hoveredNode.floor}`}
            </span>
          </div>
          <h4 className="text-sm font-bold text-white mb-0.5">{hoveredNode.name}</h4>
          <p className="text-xs text-slate-400 line-clamp-2 mb-2">{hoveredNode.description}</p>
          <div className="flex items-center justify-between text-[11px] text-slate-300 border-t border-slate-800 pt-2">
            <span>Code: <b>{hoveredNode.code}</b></span>
            <span className="text-emerald-400">Click to Select</span>
          </div>
        </div>
      )}
    </div>
  );
};

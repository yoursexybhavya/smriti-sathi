import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import { Monument, MonumentCategory } from '../../types/monument';
import { LatLng } from '../../lib/haversine';
import { Plus, Minus, Navigation, Layers, Compass } from 'lucide-react';

export type MapLayerType = 'google_terrain' | 'google_road' | 'google_satellite';

export interface MapViewProps {
  monuments: Monument[];
  selectedMonument: Monument | null;
  onSelectMonument: (monument: Monument) => void;
  userLocation: LatLng | null;
  activeCircuitId?: string | null;
  currentLayer: MapLayerType;
  onLayerChange: (layer: MapLayerType) => void;
  onLocateUser: () => void;
}

// Category icons for Google Maps POI pins
const CATEGORY_EMOJIS: Record<MonumentCategory | string, string> = {
  'Fort & Palace': '🏰',
  Temple: '🛕',
  'Tomb & Mausoleum': '🏛️',
  Mosque: '🕌',
  Stepwell: '🪜',
  'Caves & Rock-cut': '🗿',
  'Memorial & Gate': '⛩️',
  'Ancient University': '📜',
};

// Generates Google Maps POI marker matching User's Image 3
function createGooglePoiHtml(monument: Monument, isSelected: boolean): string {
  const icon = CATEGORY_EMOJIS[monument.category] || '🏛️';
  return `
    <div class="gmaps-poi-marker ${isSelected ? 'gmaps-poi-marker-selected' : ''}" data-id="${monument.id}">
      <div class="gmaps-poi-icon">
        <span style="font-size: 15px; line-height: 1;">${icon}</span>
      </div>
      <div class="gmaps-poi-label">
        <span class="gmaps-poi-title">${escapeHtml(monument.name)}</span>
        <span class="gmaps-poi-subtitle">${escapeHtml(monument.hindiName)}</span>
        <span class="gmaps-poi-category">${escapeHtml(monument.category)}</span>
      </div>
    </div>
  `;
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export const MapView: React.FC<MapViewProps> = ({
  monuments,
  selectedMonument,
  onSelectMonument,
  userLocation,
  activeCircuitId,
  currentLayer,
  onLayerChange,
  onLocateUser,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const currentTileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const [showLayerMenu, setShowLayerMenu] = useState<boolean>(false);

  // Get tile URL based on current Google Maps layer type
  const getTileUrl = (type: MapLayerType) => {
    switch (type) {
      case 'google_terrain':
        // Google Maps Terrain with hillshading & roads (matching user's Image 1)
        return 'https://mt{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}';
      case 'google_satellite':
        // Google Maps Satellite Hybrid with streets and labels
        return 'https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}';
      case 'google_road':
      default:
        // Google Maps Crisp Standard Vector Roads (matching user's Image 4)
        return 'https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
    }
  };

  // Mount Leaflet Map
  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;

    if ((container as unknown as { _leaflet_id?: number })._leaflet_id != null) {
      return;
    }

    // Initialize Map with smooth vector controls
    const map = L.map(container, {
      center: [23.5937, 78.9629], // Geographic center of India
      zoom: 5,
      minZoom: 4,
      maxZoom: 20,
      zoomControl: false,
      attributionControl: false,
      fadeAnimation: true,
      zoomAnimation: true,
    });

    // Add crisp Google Maps Tile Layer with subdomains for instant loading
    const tileLayer = L.tileLayer(getTileUrl(currentLayer), {
      subdomains: ['0', '1', '2', '3'],
      maxZoom: 20,
      tileSize: 256,
      updateWhenIdle: false,
      keepBuffer: 4,
    }).addTo(map);

    currentTileLayerRef.current = tileLayer;

    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;
    mapInstanceRef.current = map;

    // Ensure Leaflet calculates viewport dimensions correctly across all screen sizes
    const resizeObserver = new ResizeObserver(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    });
    resizeObserver.observe(container);

    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 100);

    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 400);

    return () => {
      resizeObserver.disconnect();
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      if (container) {
        delete (container as unknown as { _leaflet_id?: number })._leaflet_id;
      }
    };
  }, []);

  // Handle Layer Type Change (Default / Terrain / Satellite)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (currentTileLayerRef.current) {
      map.removeLayer(currentTileLayerRef.current);
    }

    const newTileLayer = L.tileLayer(getTileUrl(currentLayer), {
      subdomains: ['0', '1', '2', '3'],
      maxZoom: 20,
      tileSize: 256,
      updateWhenIdle: false,
      keepBuffer: 4,
    }).addTo(map);

    currentTileLayerRef.current = newTileLayer;
  }, [currentLayer]);

  // Render Google Maps Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    monuments.forEach((monument) => {
      const isSelected = selectedMonument?.id === monument.id;
      const poiHtml = createGooglePoiHtml(monument, isSelected);

      const customIcon = L.divIcon({
        className: 'gmaps-marker-wrapper',
        html: poiHtml,
        iconSize: [120, 56],
        iconAnchor: [60, 16],
      });

      const marker = L.marker([monument.coordinates.lat, monument.coordinates.lng], {
        icon: customIcon,
        zIndexOffset: isSelected ? 1000 : 100,
      });

      marker.on('click', () => {
        onSelectMonument(monument);
      });

      markersLayer.addLayer(marker);
    });
  }, [monuments, selectedMonument, onSelectMonument]);

  // Smooth flyTo selected monument
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedMonument) return;

    map.flyTo([selectedMonument.coordinates.lat, selectedMonument.coordinates.lng], 14, {
      duration: 1.2,
      easeLinearity: 0.25,
    });
  }, [selectedMonument]);

  // User Location Marker (Blue Dot like Google Maps)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (userLocation) {
      if (!userMarkerRef.current) {
        const userHtml = `
          <div class="relative flex items-center justify-center">
            <div class="w-4 h-4 bg-[#1A73E8] border-2 border-white rounded-full shadow-md"></div>
            <div class="absolute w-8 h-8 rounded-full bg-[#1A73E8]/25 animate-ping pointer-events-none"></div>
          </div>
        `;
        const userIcon = L.divIcon({
          className: 'user-marker',
          html: userHtml,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon }).addTo(map);
      } else {
        userMarkerRef.current.setLatLng([userLocation.lat, userLocation.lng]);
      }
    }
  }, [userLocation]);

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {/* Map DOM Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Bottom-Left: Google Maps "Layers" Switcher Box (Matching Image 1 & 4) */}
      <div className="absolute bottom-6 left-6 z-[800] pointer-events-auto">
        <div className="relative">
          <button
            onClick={() => setShowLayerMenu(!showLayerMenu)}
            className="group flex flex-col items-center bg-white hover:bg-gray-50 border-2 border-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105 active:scale-95"
            title="Choose Map Layer"
          >
            <div className="w-12 h-12 bg-[#2E3134] overflow-hidden relative">
              <img
                src={
                  currentLayer === 'google_satellite'
                    ? 'https://mt1.google.com/vt/lyrs=y&x=23&y=13&z=5'
                    : currentLayer === 'google_terrain'
                    ? 'https://mt1.google.com/vt/lyrs=p&x=23&y=13&z=5'
                    : 'https://mt1.google.com/vt/lyrs=m&x=23&y=13&z=5'
                }
                alt="Map Layer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition" />
            </div>
            <span className="text-[11px] font-medium text-gray-800 px-2 py-0.5 bg-white w-full text-center">
              Layers
            </span>
          </button>

          {/* Layer Options Flyout Menu */}
          {showLayerMenu && (
            <div className="absolute bottom-16 left-0 bg-white rounded-2xl shadow-2xl border border-gray-200 p-2.5 flex gap-2 z-[850] animate-in fade-in slide-in-from-bottom-2 duration-150">
              <button
                onClick={() => {
                  onLayerChange('google_terrain');
                  setShowLayerMenu(false);
                }}
                className={`flex flex-col items-center gap-1 p-1.5 rounded-xl transition ${
                  currentLayer === 'google_terrain' ? 'bg-blue-50 ring-2 ring-blue-500' : 'hover:bg-gray-100'
                }`}
              >
                <div className="w-14 h-14 rounded-lg overflow-hidden border border-gray-200">
                  <img src="https://mt1.google.com/vt/lyrs=p&x=23&y=13&z=5" alt="Terrain" className="w-full h-full object-cover" />
                </div>
                <span className="text-[11px] font-medium text-gray-700">Terrain</span>
              </button>

              <button
                onClick={() => {
                  onLayerChange('google_road');
                  setShowLayerMenu(false);
                }}
                className={`flex flex-col items-center gap-1 p-1.5 rounded-xl transition ${
                  currentLayer === 'google_road' ? 'bg-blue-50 ring-2 ring-blue-500' : 'hover:bg-gray-100'
                }`}
              >
                <div className="w-14 h-14 rounded-lg overflow-hidden border border-gray-200">
                  <img src="https://mt1.google.com/vt/lyrs=m&x=23&y=13&z=5" alt="Default" className="w-full h-full object-cover" />
                </div>
                <span className="text-[11px] font-medium text-gray-700">Default</span>
              </button>

              <button
                onClick={() => {
                  onLayerChange('google_satellite');
                  setShowLayerMenu(false);
                }}
                className={`flex flex-col items-center gap-1 p-1.5 rounded-xl transition ${
                  currentLayer === 'google_satellite' ? 'bg-blue-50 ring-2 ring-blue-500' : 'hover:bg-gray-100'
                }`}
              >
                <div className="w-14 h-14 rounded-lg overflow-hidden border border-gray-200">
                  <img src="https://mt1.google.com/vt/lyrs=y&x=23&y=13&z=5" alt="Satellite" className="w-full h-full object-cover" />
                </div>
                <span className="text-[11px] font-medium text-gray-700">Satellite</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom-Right: Google Maps Zoom & Location Controls (Matching Image 1 & 4) */}
      <div className="absolute bottom-6 right-6 z-[800] flex flex-col gap-2 pointer-events-auto">
        <button
          onClick={onLocateUser}
          className="w-10 h-10 bg-white hover:bg-gray-50 text-gray-700 hover:text-blue-600 rounded-lg shadow-md flex items-center justify-center border border-gray-200 transition active:scale-95"
          title="Your Location"
        >
          <Navigation className="w-4 h-4" />
        </button>

        <div className="bg-white rounded-lg shadow-md border border-gray-200 flex flex-col overflow-hidden">
          <button
            onClick={handleZoomIn}
            className="w-10 h-10 hover:bg-gray-50 text-gray-700 flex items-center justify-center border-b border-gray-200 transition active:scale-95"
            title="Zoom in"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="w-10 h-10 hover:bg-gray-50 text-gray-700 flex items-center justify-center transition active:scale-95"
            title="Zoom out"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Center: Google Maps Watermark & Scale Indicator */}
      <div className="absolute bottom-1 right-24 z-[700] pointer-events-none hidden sm:flex items-center gap-3 text-[10px] text-gray-600 font-sans">
        <span className="font-semibold text-gray-700 tracking-wider">Google Maps Engine</span>
        <span>·</span>
        <span>ASI Heritage Layer</span>
      </div>
    </div>
  );
};


import { useEffect } from "react";
import L from "leaflet";
import "leaflet-draw";
import "leaflet-geometryutil";

interface MapViewProps {
  mapRef: React.MutableRefObject<L.Map | null>;
  onMapReady?: () => void;
}

// Type extension to access internal Leaflet properties
interface DrawMap extends L.Map {
  _controlCorners?: {
    [key: string]: HTMLDivElement;
  };
  _controlContainer?: HTMLDivElement;
}

const MapView = ({ mapRef, onMapReady }: MapViewProps) => {
  useEffect(() => {
    console.log("MapView initializing...");
    
    // Verify Leaflet resources are loaded
    if (!L.Draw) {
      console.error("❌ L.Draw is not available! Check imports.");
    } else {
      console.log("✅ L.Draw is available:", L.Draw);
      console.log("L.Control.Draw available:", L.Control.Draw);
    }
    
    // Initialize map with options
    const map = L.map("leaflet-map", {
      center: [51.5, 7.0],
      zoom: 8,
      minZoom: 6,
      maxZoom: 22,
      zoomControl: false, // We'll add our own zoom controls
    });

    // Store map reference
    mapRef.current = map;
    console.log("✅ Map instance created and stored in mapRef");

    const MAPBOX_TOKEN = "pk.eyJ1Ijoicm9vZmVyZ2FtaW5nIiwiYSI6ImNtOHduem92dTE0dHAya3NldWRuMHVlN2UifQ.p1DH0hDh_k_1fp9HIXoVKQ";

    const satelliteLayer = L.tileLayer(
      `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=${MAPBOX_TOKEN}`,
      {
        tileSize: 512,
        zoomOffset: -1,
        maxZoom: 22,
        attribution:
          '© <a href="https://www.mapbox.com/">Mapbox</a> © <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
      }
    );

    satelliteLayer.addTo(map);
    console.log("✅ Satellite layer added to map");

    // Force rerender and notify when map is ready
    map.whenReady(() => {
      console.log("✅ Map is fully ready and loaded!");
      
      // Create control corners explicitly to avoid the "topleft" undefined error
      // This ensures the DOM elements are created before DrawTools tries to use them
      const extendedMap = map as DrawMap;
      
      if (!extendedMap._controlCorners) {
        const container = map.getContainer();
        const controlContainer = L.DomUtil.create('div', 'leaflet-control-container', container);
        
        // Cast and set internal properties
        (map as any)._controlContainer = controlContainer;
        (map as any)._controlCorners = {};
        
        const corners = ['topleft', 'topright', 'bottomleft', 'bottomright'];
        for (let i = 0; i < corners.length; i++) {
          (map as any)._controlCorners[corners[i]] = L.DomUtil.create(
            'div',
            'leaflet-' + corners[i] + ' leaflet-control',
            controlContainer
          );
        }
      }
      
      // Make sure size calculations are correct
      map.invalidateSize();
      
      // Call the onMapReady callback if provided
      if (onMapReady) {
        console.log("Executing onMapReady callback");
        onMapReady();
      }
    });

    return () => {
      console.log("🧹 Cleaning up MapView...");
      map.remove();
    };
  }, [mapRef, onMapReady]);

  return <div id="leaflet-map" className="w-full h-full" />;
};

export default MapView;

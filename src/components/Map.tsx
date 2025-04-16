
import { useRef, useEffect, useState } from "react";
import { ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import MapView from "@/components/MapView";
import { DrawTools } from "@/components/DrawTools";
import L from "leaflet";

interface MapProps {
  activeTool?: string;
  mapRef: React.MutableRefObject<L.Map | null>;
}

export function Map({ activeTool, mapRef }: MapProps) {
  const [zoomLevel, setZoomLevel] = useState(8);
  const [mapReady, setMapReady] = useState(false);

  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn();
      setZoomLevel(mapRef.current.getZoom());
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut();
      setZoomLevel(mapRef.current.getZoom());
    }
  };

  useEffect(() => {
    console.log("Aktives Tool:", activeTool);
  }, [activeTool]);

  // Handle map ready state
  const handleMapReady = () => {
    console.log("Map is ready - onMapReady triggered");
    
    // Make sure map is fully initialized before setting ready state
    if (mapRef.current) {
      // Ensure control containers are created
      mapRef.current.invalidateSize();
      console.log("✅ Map size invalidated to ensure proper rendering");
      
      // Set map as ready
      setMapReady(true);
      console.log("Map fully initialized, enabling DrawTools immediately");
    }
  };

  return (
    <div className="relative w-full h-full flex-1">
      <MapView mapRef={mapRef} onMapReady={handleMapReady} />

      {/* 🔧 Zoom Buttons */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-[1000]">
        <Button variant="secondary" size="icon" onClick={handleZoomIn}>
          <ZoomIn size={20} />
        </Button>
        <Button variant="secondary" size="icon" onClick={handleZoomOut}>
          <ZoomOut size={20} />
        </Button>
      </div>

      {/* 🧭 Anzeigen aktiver Tools */}
      <div className="absolute top-4 right-4 bg-white/90 rounded p-2 text-sm shadow z-[1000]">
        <strong>Aktives Werkzeug:</strong> {activeTool || "Standard"}
      </div>

      {/* 🛠️ Only show DrawTools when map is ready */}
      {mapReady && mapRef.current && <DrawTools map={mapRef.current} />}
    </div>
  );
}

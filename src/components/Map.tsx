
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
  const [drawToolsReady, setDrawToolsReady] = useState(false);

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

  // Enhanced map readiness checking
  useEffect(() => {
    if (mapReady && mapRef.current) {
      console.log("Map is ready, preparing DrawTools...");
      
      // Function to check if the map container is properly initialized
      const checkMapContainer = () => {
        if (!mapRef.current) return false;
        
        const container = mapRef.current.getContainer();
        if (!container || !document.body.contains(container)) {
          console.log("Map container not in DOM yet");
          return false;
        }
        
        // Check for essential Leaflet elements
        const controlContainer = container.querySelector('.leaflet-control-container');
        if (!controlContainer) {
          console.log("Control container not found yet");
          return false;
        }
        
        return true;
      };
      
      // Check if map is fully ready, if not, retry
      if (!checkMapContainer()) {
        console.log("Map not fully initialized, waiting...");
        
        // Wait longer for full initialization
        const timer = setTimeout(() => {
          if (checkMapContainer()) {
            console.log("Map container now ready, enabling DrawTools");
            setDrawToolsReady(true);
          } else {
            console.log("Still waiting for map initialization...");
            // One final attempt after another delay
            setTimeout(() => setDrawToolsReady(true), 2000);
          }
        }, 2000);
        
        return () => clearTimeout(timer);
      }
      
      console.log("Map fully initialized, enabling DrawTools immediately");
      setDrawToolsReady(true);
    }
  }, [mapReady, mapRef]);

  return (
    <div className="relative w-full h-full flex-1">
      <MapView 
        mapRef={mapRef} 
        onMapReady={() => {
          console.log("Map is ready - onMapReady triggered");
          setMapReady(true);
        }}
      />

      <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-[1000]">
        <Button variant="secondary" size="icon" onClick={handleZoomIn}>
          <ZoomIn size={20} />
        </Button>
        <Button variant="secondary" size="icon" onClick={handleZoomOut}>
          <ZoomOut size={20} />
        </Button>
      </div>

      <div className="absolute top-4 right-4 bg-white/90 rounded p-2 text-sm shadow z-[1000]">
        <strong>Aktives Werkzeug:</strong> {activeTool || "Keins"}
      </div>

      {drawToolsReady && mapRef.current && (
        <>
          <DrawTools map={mapRef.current} />
          <div className="absolute top-4 left-20 bg-white/90 rounded p-1 text-xs shadow z-[1000]">
            DrawTools aktiv
          </div>
        </>
      )}
    </div>
  );
}

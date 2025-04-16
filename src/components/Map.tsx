
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

  // Ensure map is fully ready before enabling DrawTools
  useEffect(() => {
    if (mapReady && mapRef.current) {
      console.log("Map is ready, preparing DrawTools...");
      
      // Give map time to fully initialize before adding DrawTools
      const timer = setTimeout(() => {
        console.log("Activating DrawTools now");
        setDrawToolsReady(true);
      }, 500);
      
      return () => clearTimeout(timer);
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

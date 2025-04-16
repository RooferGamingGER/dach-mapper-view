import { useRef, useEffect, useState } from "react";
import { ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import MapView from "@/components/MapView"; // ← Wichtig

interface MapProps {
  activeTool?: string;
}

export function Map({ activeTool }: MapProps) {
  const [zoomLevel, setZoomLevel] = useState(8);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Zoom-Control mit Leaflet
  const handleZoomIn = () => {
    const map = mapInstanceRef.current;
    if (map) {
      map.zoomIn();
      setZoomLevel(map.getZoom());
    }
  };

  const handleZoomOut = () => {
    const map = mapInstanceRef.current;
    if (map) {
      map.zoomOut();
      setZoomLevel(map.getZoom());
    }
  };

  useEffect(() => {
    console.log("Map tool selected:", activeTool);
  }, [activeTool]);

  return (
    <div className="relative w-full h-full flex-1">
      {/* Interaktive Karte */}
      <MapView mapRef={mapInstanceRef} />

      {/* Zoom Buttons */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-[1000]">
        <Button variant="secondary" size="icon" onClick={handleZoomIn}>
          <ZoomIn size={20} />
          <span className="sr-only">Zoom In</span>
        </Button>
        <Button variant="secondary" size="icon" onClick={handleZoomOut}>
          <ZoomOut size={20} />
          <span className="sr-only">Zoom Out</span>
        </Button>
      </div>

      {/* Tool-Anzeige */}
      <div className="absolute top-4 right-4 bg-white/90 rounded p-2 text-sm shadow z-[1000]">
        <div>
          <strong>Aktives Werkzeug:</strong> {activeTool || "Keins"}
        </div>
        <div className="text-xs text-gray-600 mt-1">
          Klicken Sie auf der Karte, um zu zeichnen
        </div>
      </div>
    </div>
  );
}

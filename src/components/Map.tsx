
import { useEffect, useRef, useState } from "react";
import { ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MapProps {
  activeTool?: string;
}

export function Map({ activeTool }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  
  const increaseZoom = () => {
    setZoom(Math.min(zoom + 0.2, 2));
  };
  
  const decreaseZoom = () => {
    setZoom(Math.max(zoom - 0.2, 0.5));
  };
  
  useEffect(() => {
    // This would be where we'd initialize a real map library
    console.log("Map initialized with tool:", activeTool);
  }, [activeTool]);
  
  return (
    <div className="relative w-full h-full flex-1 bg-gray-100 overflow-hidden">
      {/* Mock map content - in a real app this would be a mapping library */}
      <div 
        ref={mapRef} 
        className="w-full h-full bg-[url('https://geoportal.nrw/application/geoportal/vendor/mapbender/src/Mapbender/CoreBundle/Resources/public/mapbender.element.map.js')] bg-cover bg-center"
        style={{ 
          backgroundImage: "url('https://img.topky.sk/900px/1674645.jpg/google-maps-mapa.jpg')",
          transform: `scale(${zoom})`,
          transition: "transform 0.3s ease"
        }}
      />
      
      {/* Zoom controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <Button
          variant="secondary"
          size="icon"
          className="bg-white shadow-md hover:bg-gray-100"
          onClick={increaseZoom}
        >
          <ZoomIn size={20} />
          <span className="sr-only">Zoom In</span>
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="bg-white shadow-md hover:bg-gray-100"
          onClick={decreaseZoom}
        >
          <ZoomOut size={20} />
          <span className="sr-only">Zoom Out</span>
        </Button>
      </div>
      
      {/* Info display */}
      <div className="absolute top-4 right-4 bg-white/90 rounded p-2 text-sm">
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


import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet-draw";

interface DrawToolsProps {
  map: L.Map;
}

export function DrawTools({ map }: DrawToolsProps) {
  const [drawControl, setDrawControl] = useState<L.Control.Draw | null>(null);

  useEffect(() => {
    // Ensure the map is initialized and has control containers ready
    if (!map || !map.getContainer()) {
      console.log("Map not fully initialized yet, will try again...");
      return;
    }

    // Check if the map's control containers are ready
    if (!map._controlCorners || !map._controlCorners.topleft) {
      console.log("Map control containers not ready yet, waiting...");
      
      // Give the map time to fully initialize its DOM elements
      const timer = setTimeout(() => {
        console.log("Retrying DrawTools initialization...");
        
        // Force map to create control corners if needed
        map.invalidateSize();
        
        // This will trigger a re-render and another attempt
        setDrawControl(null);
      }, 500);
      
      return () => clearTimeout(timer);
    }

    try {
      console.log("🔍 Initializing DrawTools...");
      
      // Define draw options
      const drawOptions = {
        position: 'topleft',
        draw: {
          polyline: {
            shapeOptions: {
              color: '#f357a1',
              weight: 5
            }
          },
          polygon: {
            allowIntersection: false,
            drawError: {
              color: '#e1e100',
              message: '<strong>Fehler:</strong> Polygone dürfen sich nicht überschneiden!'
            },
            shapeOptions: {
              color: '#3388ff',
              weight: 3
            }
          },
          circle: false,
          rectangle: {
            shapeOptions: {
              color: '#3388ff',
              weight: 3
            }
          },
          marker: true
        }
      };

      // Create and add draw control to map
      const control = new L.Control.Draw(drawOptions);
      control.addTo(map);
      setDrawControl(control);
      
      console.log("✅ DrawControl added successfully!");

      // Setup event listeners for when shapes are created
      map.on(L.Draw.Event.CREATED, (event: any) => {
        const layer = event.layer;
        
        // Add the new layer to the map
        layer.addTo(map);
        
        // Display area measurement for polygons and rectangles
        if (event.layerType === 'polygon' || event.layerType === 'rectangle') {
          const area = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
          const readableArea = area < 10000 
            ? `${Math.round(area)}m²` 
            : `${Math.round(area / 10000 * 100) / 100}ha`;
          
          layer.bindTooltip(readableArea, {
            permanent: true,
            direction: 'center',
            className: 'area-label'
          }).openTooltip();
        }
      });

      return () => {
        // Clean up by removing control when component unmounts
        if (control && map) {
          map.removeControl(control);
        }
      };
    } catch (error) {
      console.error("❌ Error adding drawControl:", error);
    }
  }, [map]);

  return null; // This component doesn't render anything visible
}

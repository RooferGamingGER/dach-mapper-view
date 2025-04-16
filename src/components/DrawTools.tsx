
import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet-draw";

interface DrawToolsProps {
  map: L.Map;
}

// Type extension to access internal Leaflet properties
interface LeafletMapExtended extends L.Map {
  _controlCorners?: {
    [key: string]: HTMLDivElement;
  };
  _controlContainer?: HTMLDivElement;
}

export function DrawTools({ map }: DrawToolsProps) {
  const [drawControl, setDrawControl] = useState<L.Control.Draw | null>(null);

  useEffect(() => {
    // Cast to extended map to access internal properties
    const extendedMap = map as LeafletMapExtended;

    // Ensure the map is initialized and has control containers ready
    if (!map || !map.getContainer()) {
      console.log("Map not fully initialized yet, will try again...");
      return;
    }

    // Check if the map's control containers are ready
    if (!extendedMap._controlCorners || !extendedMap._controlCorners.topleft) {
      console.log("Map control containers not ready yet, waiting...");
      
      // Create control containers explicitly if they don't exist
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
      
      // Force map to refresh
      map.invalidateSize();
    }

    try {
      console.log("🔍 Initializing DrawTools...");
      
      // Define draw options with correct ControlPosition type
      const drawOptions: L.Control.DrawConstructorOptions = {
        position: 'topleft' as L.ControlPosition,
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


import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet-draw";
import "leaflet-geometryutil";

interface DrawToolsProps {
  map: L.Map | null;
}

export const DrawTools = ({ map }: DrawToolsProps) => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!map) {
      console.warn("🛑 Map reference is null - DrawTools skipped");
      return;
    }

    // Ensure that L.Draw is properly loaded
    if (!L.Draw || !L.Control.Draw) {
      console.error("❌ L.Draw or L.Control.Draw is not available!");
      console.log("L.Draw:", L.Draw);
      console.log("L.Control:", L.Control);
      return;
    }

    // We'll wait for both the map to be ready and properly initialized in the DOM
    const initializeDrawTools = () => {
      // Ensure the map container exists and is in the DOM
      if (!map.getContainer() || !document.body.contains(map.getContainer())) {
        console.log("Map container not ready yet, trying again in 500ms...");
        setTimeout(initializeDrawTools, 500);
        return;
      }

      try {
        console.log("🔍 Initializing DrawTools...");
        
        // Verify that the leaflet-control-container exists
        const controlContainer = map.getContainer().querySelector('.leaflet-control-container');
        if (!controlContainer) {
          console.warn("Control container not found, waiting for Leaflet to initialize fully...");
          setTimeout(initializeDrawTools, 500);
          return;
        }

        // Create feature group for drawn items
        const drawnItems = new L.FeatureGroup();
        map.addLayer(drawnItems);
        
        // Check if the top-left control container exists
        const topLeftControl = map.getContainer().querySelector('.leaflet-top.leaflet-left');
        if (!topLeftControl) {
          console.warn("Top-left control container not found, creating manually...");
          
          // Create manually if missing
          const controlContainer = map.getContainer().querySelector('.leaflet-control-container');
          if (!controlContainer) {
            const newControlContainer = document.createElement('div');
            newControlContainer.className = 'leaflet-control-container';
            map.getContainer().appendChild(newControlContainer);
          }
          
          const leafletTop = document.createElement('div');
          leafletTop.className = 'leaflet-top leaflet-left';
          map.getContainer().querySelector('.leaflet-control-container')?.appendChild(leafletTop);
        }
        
        // Now create the draw control
        const drawControl = new L.Control.Draw({
          position: 'topleft',
          draw: {
            polygon: {
              allowIntersection: false,
              showArea: true,
              shapeOptions: {
                color: "#ff0000",
              },
            },
            marker: false,
            polyline: false,
            rectangle: false,
            circle: false,
            circlemarker: false,
          },
          edit: {
            featureGroup: drawnItems,
            remove: true,
          },
        });

        try {
          map.addControl(drawControl);
          console.log("✅ Drawing tools added successfully");
          setInitialized(true);
        } catch (error) {
          console.error("❌ Error adding drawControl:", error);
        }

        map.on(L.Draw.Event.CREATED, (e: L.DrawEvents.Created) => {
          const layer = e.layer;
          drawnItems.addLayer(layer);

          if ("getLatLngs" in layer) {
            const latlngs = (layer as L.Polygon).getLatLngs()[0] as L.LatLng[];
            const area = L.GeometryUtil.geodesicArea(latlngs);
            const readable = `${(area / 1_000_000).toFixed(2)} m²`;

            const center = (layer as L.Polygon).getBounds().getCenter();

            const label = L.marker(center, {
              icon: L.divIcon({
                className: "area-label",
                html: `<strong>${readable}</strong>`,
              }),
            });

            map.addLayer(label);
          }
        });

        // Clean-up
        return () => {
          map.removeLayer(drawnItems);
          if (initialized) {
            try {
              map.removeControl(drawControl);
            } catch (e) {
              console.warn("Error removing drawControl:", e);
            }
          }
        };
      } catch (error) {
        console.error("💥 Error in DrawTools initialization:", error);
      }
    };

    // Start initialization with a slight delay to ensure DOM is ready
    setTimeout(initializeDrawTools, 1000);
  }, [map]);

  return null;
};

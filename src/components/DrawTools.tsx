
import { useEffect } from "react";
import L from "leaflet";
import "leaflet-draw";
import "leaflet-geometryutil";

interface DrawToolsProps {
  map: L.Map | null;
}

export const DrawTools = ({ map }: DrawToolsProps) => {
  useEffect(() => {
    if (!map) {
      console.warn("🛑 Map is null in DrawTools - skipping initialization");
      return;
    }

    // Verify map container exists in DOM
    if (!map.getContainer() || !document.body.contains(map.getContainer())) {
      console.warn("❌ Map container not found in DOM. Aborting DrawTools initialization.");
      return;
    }

    console.log("✅ DrawTools initializing with Map:", map);

    // Create feature group for drawn items
    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);
    console.log("✅ Added drawnItems layer to map");

    // Check if L.Control and L.Control.Draw are available
    if (!L.Control || !L.Control.Draw) {
      console.error("❌ L.Control.Draw is not available! Check imports:", L.Control, L.Control.Draw);
      return;
    }

    // Force reload leaflet-draw control
    try {
      // Explicitly require leaflet-draw to ensure it's loaded
      require("leaflet-draw");
      console.log("✅ Leaflet-draw explicitly loaded");
    } catch (e) {
      console.error("❌ Failed to load leaflet-draw:", e);
    }

    // Ensure the Control.Draw constructor exists
    if (typeof L.Control.Draw !== 'function') {
      console.error("❌ L.Control.Draw is not a constructor:", L.Control.Draw);
      return;
    }

    // Configure draw control with specific options and ensure it's created correctly
    try {
      console.log("➡️ Creating draw control...");
      
      const drawControl = new L.Control.Draw({
        position: "topleft",
        draw: {
          polygon: {
            allowIntersection: false,
            showArea: true,
            shapeOptions: {
              color: "#ff0000",
              weight: 3,
              opacity: 0.8,
              fillOpacity: 0.3,
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
      
      console.log("✅ Draw control created:", drawControl);

      // Add control with delayed execution and proper error handling
      console.log("➡️ Adding draw control to map...");
      map.addControl(drawControl);
      console.log("✅ Draw control successfully added to map");
      
      // Force redraw of the map to ensure controls are visible
      setTimeout(() => {
        map.invalidateSize();
        console.log("✅ Map invalidated to refresh draw controls");
      }, 500);
    } catch (error) {
      console.error("❌ Error creating/adding drawControl:", error);
    }

    // Handle draw events
    map.on(L.Draw.Event.CREATED, (e: L.DrawEvents.Created) => {
      console.log("✏️ Draw created event fired", e);
      const layer = e.layer;
      drawnItems.addLayer(layer);

      if ("getLatLngs" in layer) {
        const latlngs = (layer as L.Polygon).getLatLngs()[0] as L.LatLng[];
        const area = L.GeometryUtil.geodesicArea(latlngs);
        // Format area properly: m² for small areas, km² for large ones
        const areaValue = area < 1_000_000 
          ? `${Math.round(area)} m²` 
          : `${(area / 1_000_000).toFixed(2)} km²`;
          
        const center = (layer as L.Polygon).getBounds().getCenter();

        const label = L.marker(center, {
          icon: L.divIcon({
            className: "area-label",
            html: `<div class="area-value">${areaValue}</div>`,
          }),
          interactive: false, // Prevents the marker from being treated as "mark"
        });

        map.addLayer(label);
        console.log("✅ Added area label:", areaValue);
      }
    });

    return () => {
      console.log("🧹 Cleaning up DrawTools...");
      try {
        if (map && map.getContainer() && document.body.contains(map.getContainer())) {
          map.removeLayer(drawnItems);
          // Find and remove draw control
          map.getContainer().querySelectorAll('.leaflet-draw').forEach(el => {
            if (el.parentNode) {
              el.parentNode.removeChild(el);
            }
          });
          console.log("✅ DrawTools cleanup complete");
        }
      } catch (err) {
        console.error("❌ Error during DrawTools cleanup:", err);
      }
    };
  }, [map]);

  return null;
};

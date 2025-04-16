import { useEffect } from "react";
import L from "leaflet";
import "leaflet-draw";
import "leaflet-geometryutil";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

interface DrawToolsProps {
  map: L.Map | null;
}

export const DrawTools = ({ map }: DrawToolsProps) => {
  useEffect(() => {
    if (!map) {
      console.warn("🛑 mapRef.current ist null – DrawTools wird übersprungen.");
      return;
    }

    // Warte bis Leaflet vollständig bereit ist
    map.whenReady(() => {
      console.log("✅ DrawTools aktiviert auf Map:", map);

      const drawnItems = new L.FeatureGroup();
      map.addLayer(drawnItems);

      const drawControl = new L.Control.Draw({
        position: "topleft", // ⬅️ notwendig für sichtbare UI
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
        console.log("✅ Zeichenwerkzeuge hinzugefügt.");
      } catch (err) {
        console.error("❌ Fehler beim Hinzufügen des drawControl:", err);
      }

      map.on(L.Draw.Event.CREATED, (e: L.DrawEvents.Created) => {
        const layer = e.layer;
        drawnItems.addLayer(layer);

        // Fläche berechnen
        if ("getLatLngs" in layer) {
          const latlngs = (layer as L.Polygon).getLatLngs()[0] as L.LatLng[];
          const area = L.GeometryUtil.geodesicArea(latlngs);
          const readable = `${(area / 1_000_000).toFixed(2)} m²`;

          const center = (layer as L.Polygon).getBounds().getCenter();

          // Label als Marker
          const label = L.marker(center, {
            icon: L.divIcon({
              className: "area-label",
              html: `<strong>${readable}</strong>`,
            }),
          });

          map.addLayer(label);
        }
      });

      // Cleanup bei Unmount
      return () => {
        console.log("🧹 Entferne DrawTools...");
        map.removeLayer(drawnItems);
        map.removeControl(drawControl);
      };
    });
  }, [map]);

  return null;
};

import { useEffect } from "react";
import L from "leaflet";
import "leaflet-draw";
import "leaflet-geometryutil";

interface DrawToolsProps {
  map: L.Map | null;
}

export const DrawTools = ({ map }: DrawToolsProps) => {
  useEffect(() => {
    if (!map) return;

    let retryCount = 0;
    const MAX_RETRIES = 30;

    const tryEnableDrawTools = () => {
      if (!map._controlCorners) {
        console.warn("⏳ map._controlCorners noch nicht verfügbar... erneuter Versuch in 200ms");
        retryCount++;
        if (retryCount > MAX_RETRIES) {
          console.error("❌ DrawTools konnten nicht aktiviert werden – max. Versuche erreicht.");
          return;
        }
        setTimeout(tryEnableDrawTools, 200);
        return;
      }

      console.log("✅ map._controlCorners gefunden – Zeichentools werden geladen...");

      const drawnItems = new L.FeatureGroup();
      map.addLayer(drawnItems);

      const drawControl = new L.Control.Draw({
        position: "topleft",
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
      } catch (error) {
        console.error("❌ Fehler beim Hinzufügen des drawControl:", error);
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
    };

    map.whenReady(() => {
      console.log("🔍 Initializing DrawTools...");
      setTimeout(tryEnableDrawTools, 200); // Erst nach etwas Delay starten
    });

    return () => {
      console.log("🧹 Cleanup DrawTools");
    };
  }, [map]);

  return null;
};

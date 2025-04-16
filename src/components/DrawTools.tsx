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
      console.warn("🛑 Kein mapRef übergeben.");
      return;
    }

    const container = map.getContainer();
    if (!container || !document.body.contains(container)) {
      console.warn("🛑 Map-Container ist (noch) nicht im DOM.");
      return;
    }

    const enableDrawTools = () => {
      try {
        console.log("🔍 Initializing DrawTools...");

        const drawnItems = new L.FeatureGroup();
        map.addLayer(drawnItems);

        const drawControl = new (L.Control as any).Draw({
          position: "topright", // <== Change position here if needed
          draw: {
            polygon: {
              allowIntersection: false,
              showArea: true,
              shapeOptions: { color: "#ff0000" },
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

        if (!map._controlCorners) {
          console.warn("🛑 map._controlCorners nicht verfügbar, DrawControl nicht möglich.");
          return;
        }

        map.addControl(drawControl);
        console.log("✅ Draw control added to map successfully");

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

        return () => {
          console.log("🧹 Cleanup DrawTools");
          map.removeLayer(drawnItems);
          map.removeControl(drawControl);
        };
      } catch (err) {
        console.error("❌ Fehler beim Initialisieren der DrawTools:", err);
      }
    };

    // Einmal warten, um sicherzugehen, dass alles ready ist
    const timeout = setTimeout(() => {
      if (map._controlCorners) {
        enableDrawTools();
      } else {
        console.warn("🛑 map._controlCorners fehlt trotz Delay. Abbruch.");
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [map]);

  return null;
};

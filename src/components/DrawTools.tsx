import { useEffect } from "react";
import L from "leaflet";
import "leaflet-draw"; // Muss vor der Verwendung geladen sein
import "leaflet-geometryutil";

interface DrawToolsProps {
  map: L.Map | null;
}

export const DrawTools = ({ map }: DrawToolsProps) => {
  useEffect(() => {
    if (!map) {
      console.warn("🛑 Kein Map-Objekt vorhanden. Zeichentools werden nicht geladen.");
      return;
    }

    // Zeichentools erst aktivieren, wenn die Karte wirklich bereit ist
    const init = () => {
      console.log("✅ DrawTools aktiv mit Map:", map);

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
        console.log("✅ Zeichenwerkzeuge erfolgreich hinzugefügt.");
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

      // Cleanup bei Unmount
      return () => {
        try {
          map.removeLayer(drawnItems);
          map.removeControl(drawControl);
        } catch (err) {
          console.warn("❗ Fehler beim Entfernen von DrawTools:", err);
        }
      };
    };

    // Verzögertes Initialisieren nach whenReady
    map.whenReady(() => {
      setTimeout(init, 300);
    });
  }, [map]);

  return null;
};

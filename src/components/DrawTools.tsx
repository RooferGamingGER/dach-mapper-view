
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
      console.warn("🛑 mapRef.current ist noch null – DrawTools überspringt.");
      return;
    }

    if (!map.getContainer() || !document.body.contains(map.getContainer())) {
      console.warn("❌ Map container nicht im DOM gefunden. Abbruch.");
      return;
    }

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

    // SetTimeout als Fallback bei Control-Zugriffsproblemen
    setTimeout(() => {
      map.whenReady(() => {
        try {
          map.addControl(drawControl);
          console.log("✅ Draw control erfolgreich hinzugefügt.");
        } catch (error) {
          console.error("❌ Fehler beim Hinzufügen des drawControl:", error);
        }
      });
    }, 500); // Delay um sicherzustellen, dass die Map bereit ist

    map.on(L.Draw.Event.CREATED, (e: L.DrawEvents.Created) => {
      const layer = e.layer;
      drawnItems.addLayer(layer);

      if ("getLatLngs" in layer) {
        const latlngs = (layer as L.Polygon).getLatLngs()[0] as L.LatLng[];
        const area = L.GeometryUtil.geodesicArea(latlngs);
        // Formatiere die Fläche richtig: m² für kleine Flächen, km² für große
        const areaValue = area < 1_000_000 
          ? `${Math.round(area)} m²` 
          : `${(area / 1_000_000).toFixed(2)} km²`;
          
        const center = (layer as L.Polygon).getBounds().getCenter();

        const label = L.marker(center, {
          icon: L.divIcon({
            className: "area-label",
            html: `<div class="area-value">${areaValue}</div>`,
          }),
          interactive: false, // Verhindert dass der Marker als "mark" behandelt wird
        });

        map.addLayer(label);
      }
    });

    return () => {
      try {
        if (map && map.getContainer() && document.body.contains(map.getContainer())) {
          map.removeLayer(drawnItems);
          map.removeControl(drawControl);
        }
      } catch (err) {
        console.error("🧹 Fehler beim Entfernen von DrawTools:", err);
      }
    };
  }, [map]);

  return null;
};

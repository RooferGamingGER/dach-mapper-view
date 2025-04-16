
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

    console.log("✅ DrawTools aktiv mit Map:", map);

    // Check if the map container exists in the DOM
    if (!map.getContainer() || !document.body.contains(map.getContainer())) {
      console.warn("Map container not found in DOM. Skipping DrawTools initialization.");
      return;
    }

    // Layer zum Speichern der Zeichnungen
    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    // Konfiguration der Zeichenwerkzeuge
    const drawControl = new L.Control.Draw({
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

    // Add draw control to map once it's ready
    try {
      map.addControl(drawControl);
      console.log("✅ Draw control added to map successfully");
    } catch (error) {
      console.error("Failed to add draw control to map:", error);
    }

    // Ereignis: Neues Polygon gezeichnet
    map.on(L.Draw.Event.CREATED, (e: L.DrawEvents.Created) => {
      const layer = e.layer;

      // Polygon hinzufügen
      drawnItems.addLayer(layer);

      // Fläche berechnen
      if ("getLatLngs" in layer) {
        const latlngs = (layer as L.Polygon).getLatLngs()[0] as L.LatLng[];
        const area = L.GeometryUtil.geodesicArea(latlngs);
        const readable = `${(area / 1_000_000).toFixed(2)} m²`;

        const center = (layer as L.Polygon).getBounds().getCenter();

        // Textlabel als Marker einfügen
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
        // Check if map and its container still exist
        if (map && map.getContainer() && document.body.contains(map.getContainer())) {
          map.removeLayer(drawnItems);
          map.removeControl(drawControl);
        }
      } catch (err) {
        console.error("Error during cleanup:", err);
      }
    };
  }, [map]);

  return null;
};

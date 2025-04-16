import { useEffect } from "react";
import L from "leaflet";
import "leaflet-draw"; // importiert Zeichen-Plugin
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-geometryutil";

interface DrawToolsProps {
  map: L.Map | null;
}

export const DrawTools = ({ map }: DrawToolsProps) => {
  useEffect(() => {
    if (!map) return;

    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    const drawControl = new L.Control.Draw({
      draw: {
        polyline: false,
        rectangle: false,
        circle: false,
        marker: false,
        circlemarker: false,
        polygon: {
          allowIntersection: false,
          showArea: true,
          shapeOptions: {
            color: "#ff7800",
            weight: 2,
          },
        },
      },
      edit: {
        featureGroup: drawnItems,
        remove: true,
      },
    });

    map.addControl(drawControl);

    map.on(L.Draw.Event.CREATED, (e: any) => {
      const layer = e.layer;
      const latlngs = layer.getLatLngs()[0];

      // Fläche berechnen
      const area = L.GeometryUtil.geodesicArea(latlngs);
      const readableArea = (area / 1000000).toFixed(2); // m²

      // Zentroid berechnen
      const center = layer.getBounds().getCenter();

      // Text-Label hinzufügen
      const label = L.marker(center, {
        icon: L.divIcon({
          className: "leaflet-tooltip",
          html: `<strong>${readableArea} m²</strong>`,
        }),
      });

      label.addTo(map);
      drawnItems.addLayer(layer);
    });
  }, [map]);

  return null;
};

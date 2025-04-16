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
    console.log("📏 DrawTools aktiviert", map);
    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

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

    map.addControl(drawControl);

    map.on(L.Draw.Event.CREATED, (e: any) => {
      const layer = e.layer;
      drawnItems.addLayer(layer);

      const latlngs = layer.getLatLngs()[0];
      const area = L.GeometryUtil.geodesicArea(latlngs);
      const readable = `${(area / 1_000_000).toFixed(2)} m²`;

      const center = layer.getBounds().getCenter();

      const label = L.marker(center, {
        icon: L.divIcon({
          className: "leaflet-tooltip",
          html: `<strong>${readable}</strong>`,
        }),
      });

      map.addLayer(label);
    });
  }, [map]);

  return null;
};

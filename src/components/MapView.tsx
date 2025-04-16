
import { useEffect } from "react";
import L from "leaflet";

interface MapViewProps {
  mapRef: React.MutableRefObject<L.Map | null>;
  onMapReady?: () => void;
}

const MapView = ({ mapRef, onMapReady }: MapViewProps) => {
  useEffect(() => {
    const map = L.map("leaflet-map", {
      center: [51.5, 7.0],
      zoom: 8,
      minZoom: 6,
      maxZoom: 22,
      zoomControl: true,
    });

    mapRef.current = map;

    const MAPBOX_TOKEN = "pk.eyJ1Ijoicm9vZmVyZ2FtaW5nIiwiYSI6ImNtOHduem92dTE0dHAya3NldWRuMHVlN2UifQ.p1DH0hDh_k_1fp9HIXoVKQ";

    const satelliteLayer = L.tileLayer(
      `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=${MAPBOX_TOKEN}`,
      {
        tileSize: 512,
        zoomOffset: -1,
        maxZoom: 22,
        attribution:
          '© <a href="https://www.mapbox.com/">Mapbox</a> © <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
      }
    );

    satelliteLayer.addTo(map);

    // Notify when map is ready
    map.whenReady(() => {
      console.log("Map is ready and loaded!");
      if (onMapReady) {
        onMapReady();
      }
    });

    return () => {
      map.remove();
    };
  }, [mapRef, onMapReady]);

  return <div id="leaflet-map" className="w-full h-full" />;
};

export default MapView;

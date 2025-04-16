import { useEffect } from "react";
import L from "leaflet";

interface MapViewProps {
  mapRef: React.MutableRefObject<L.Map | null>;
}

const MapView = ({ mapRef }: MapViewProps) => {
  useEffect(() => {
    const map = L.map("leaflet-map", {
      center: [51.5, 7.0],
      zoom: 8,
      minZoom: 6,
      maxZoom: 22,
      zoomControl: false,
    });

    mapRef.current = map;
    console.log("Leaflet Map wurde erstellt und in mapRef gespeichert:", map);

    L.tileLayer.wms("https://www.wms.nrw.de/geobasis/wms_nw_dop?", {
      layers: "nw_dop_rgb",
      format: "image/jpeg",
      transparent: false,
      version: "1.3.0",
      attribution: "© GeoBasis NRW 2023",
    }).addTo(map);

    return () => {
      map.remove();
    };
  }, [mapRef]);

  return <div id="leaflet-map" className="w-full h-full" />;
};

export default MapView;

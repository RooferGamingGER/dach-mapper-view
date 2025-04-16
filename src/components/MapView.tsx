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

    // --- WMTS-Einbindung für Digitale Orthophotos NRW (Farbe) ---
    const wmtsUrl = "https://www.wmts.nrw.de/geobasis/wmts_nw_dop";

    const wmtsOptions = {
      attribution:
        '© Land NRW (2025) | <a href="https://www.bezreg-koeln.nrw.de/brk_internet/geobasis/web-dienste/geodatendienste/index.html" target="_blank">GeoBasis-DE/LGB NRW</a>',
      tileSize: 256,
      maxZoom: 21,
      noWrap: true,
    };

    const wmtsLayerUrl = `${wmtsUrl}/nw_dop_rgb/default/WebMercatorQuad/{z}/{y}/{x}.jpeg`;

    const orthofotoLayer = L.tileLayer(wmtsLayerUrl, wmtsOptions);

    orthofotoLayer.addTo(map);

    return () => {
      map.remove();
    };
  }, [mapRef]);

  return <div id="leaflet-map" className="w-full h-full" />;
};

export default MapView;

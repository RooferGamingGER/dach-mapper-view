import { useEffect } from "react";
import L from "leaflet";

interface MapViewProps {
  mapRef: React.MutableRefObject<L.Map | null>;
}

const MapView = ({ mapRef }: MapViewProps) => {
  useEffect(() => {
    // Leaflet-Karte initialisieren
    const map = L.map("leaflet-map", {
      center: [51.5, 7.0],
      zoom: 8,
      minZoom: 6,
      maxZoom: 21,
      zoomControl: false,
    });

    // Referenz speichern
    mapRef.current = map;

    console.log("Leaflet Map wurde erstellt und in mapRef gespeichert:", map);

    // WMTS-Konfiguration für Geoportal NRW (Digitale Orthophotos RGB)
    const wmtsUrl =
      "https://www.wmts.nrw.de/geobasis/wmts_nw_dop/nw_dop_rgb/default/WebMercatorQuad/{z}/{y}/{x}.jpeg";

    const wmtsOptions = {
      tileSize: 256,
      maxZoom: 22,
      attribution:
        '© Land NRW (2025) | <a href="https://www.bezreg-koeln.nrw.de" target="_blank">GeoBasis NRW</a>',
      crossOrigin: true,
    };

    // Orthofoto-Layer hinzufügen
    const orthofotoLayer = L.tileLayer(wmtsUrl, wmtsOptions);
    orthofotoLayer.addTo(map);

    // Cleanup
    return () => {
      map.remove();
    };
  }, [mapRef]);

  return <div id="leaflet-map" className="w-full h-full" />;
};

export default MapView;

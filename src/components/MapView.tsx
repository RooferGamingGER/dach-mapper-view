import { useEffect } from "react";
import L from "leaflet";

interface MapViewProps {
  mapRef: React.MutableRefObject<L.Map | null>;
}

const MapView = ({ mapRef }: MapViewProps) => {
  useEffect(() => {
    // Initialisiere Leaflet-Karte
    const map = L.map("leaflet-map", {
      center: [51.5, 7.0],
      zoom: 8,
      minZoom: 6,
      maxZoom: 22, // bis Zoom 19 sind Bilder verfügbar
      zoomControl: true,
    });

    mapRef.current = map;

    console.log("Map initialisiert und gespeichert", map);

    // Korrekte WMTS-URL (Achtung: KEIN {x}/{y}/{z}-Format!)
    const wmtsLayer = L.tileLayer(
      "https://www.wmts.nrw.de/geobasis/wmts_nw_dop?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0" +
        "&LAYER=nw_dop_rgb" +
        "&STYLE=default" +
        "&TILEMATRIXSET=WebMercatorQuad" +
        "&TILEMATRIX={z}" +
        "&TILEROW={y}" +
        "&TILECOL={x}" +
        "&FORMAT=image/jpeg",
      {
        tileSize: 256,
        maxZoom: 19,
        attribution:
          '© Land NRW (2025) | <a href="https://www.bezreg-koeln.nrw.de" target="_blank">GeoBasis NRW</a>',
        crossOrigin: true,
      }
    );

    wmtsLayer.addTo(map);

    return () => {
      map.remove();
    };
  }, [mapRef]);

  return <div id="leaflet-map" className="w-full h-full" />;
};

export default MapView;

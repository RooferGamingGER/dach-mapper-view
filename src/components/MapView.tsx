'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Koordinatenbereich von NRW (SW / NE)
const NRW_BOUNDS: L.LatLngBoundsLiteral = [
  [50.2, 5.8],
  [52.6, 9.5],
];

const MapView = () => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = L.map(mapRef.current, {
      center: [51.5, 7.0], // NRW Mitte
      zoom: 8,
      minZoom: 6,
      maxZoom: 22,
      maxBounds: NRW_BOUNDS,
      zoomControl: false,
    });

    // WMS Layer – Orthofoto NRW
    L.tileLayer.wms('https://www.wms.nrw.de/geobasis/wms_nw_dop?', {
      layers: 'nw_dop_rgb',
      format: 'image/jpeg',
      transparent: false,
      version: '1.3.0',
      attribution: '© GeoBasis NRW 2023',
    }).addTo(map);

    // Optional: Zoom-In/Out Buttons rechts unten
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div
      ref={mapRef}
      id="leaflet-map"
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default MapView;

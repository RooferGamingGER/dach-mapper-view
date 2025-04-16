
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './leaflet.css';
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css"; 

// Import leaflet and plugins explicitly to ensure they're loaded
import L from 'leaflet';
import 'leaflet-draw';
import "leaflet-geometryutil";

// Fix Leaflet icon paths for markers (important for proper rendering)
// @ts-ignore - This is a known fix for Leaflet in bundled environments
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Initialize any required Leaflet plugins
if (L.Control && !L.Control.Draw) {
  console.error("Leaflet Draw not initialized properly");
} else {
  console.log("Leaflet Draw initialized:", !!L.Control?.Draw);
}

// Log Leaflet version and availability of key components
console.log("Leaflet version:", L.version);
console.log("L.Draw available:", !!L.Draw);
console.log("L.Control.Draw available:", !!L.Control?.Draw);

// Add a small delay before mounting to ensure CSS is loaded
setTimeout(() => {
  console.log("🚀 Starting application with all Leaflet resources");
  createRoot(document.getElementById("root")!).render(<App />);
}, 300);

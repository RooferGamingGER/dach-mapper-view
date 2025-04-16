
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

// Log Leaflet version and availability of key components
console.log("Leaflet version:", L.version);
console.log("L.Draw available:", !!L.Draw);
console.log("L.Control.Draw available:", !!L.Control?.Draw);

// Add a small delay before mounting to ensure CSS is loaded
setTimeout(() => {
  console.log("🚀 Starting application with all Leaflet resources");
  createRoot(document.getElementById("root")!).render(<App />);
}, 300);

import { createRoot } from 'react-dom/client';
import App from './App.tsx';

// 🟢 Leaflet CSS zuerst
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

// 🟢 Danach dein eigenes CSS
import './index.css';
import './leaflet.css';

// Plugins & Logging
import L from 'leaflet';
import 'leaflet-draw';
import 'leaflet-geometryutil';

console.log("📦 Leaflet version:", L.version);
console.log("🔍 L.Draw available:", !!L.Draw);
console.log("🛠️ L.Control.Draw available:", !!L.Control?.Draw);

// Optionaler Delay, aber nicht zwingend nötig
createRoot(document.getElementById("root")!).render(<App />);

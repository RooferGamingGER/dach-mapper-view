
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './leaflet.css'  // Add Leaflet CSS import
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css"; // ✅ DIES ist wichtig

createRoot(document.getElementById("root")!).render(<App />);

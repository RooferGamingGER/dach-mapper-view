
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './leaflet.css'
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css"; 

// Import leaflet-geometryutil as a module
import "leaflet-geometryutil";

// Add a small delay before mounting to ensure CSS is loaded
setTimeout(() => {
  console.log("🚀 Starting application with all Leaflet resources");
  createRoot(document.getElementById("root")!).render(<App />);
}, 100);

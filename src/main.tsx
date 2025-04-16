
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './leaflet.css'
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css"; // Ensure Leaflet Draw CSS is imported
// Import leaflet-geometryutil as a module instead of direct file path
import "leaflet-geometryutil";

createRoot(document.getElementById("root")!).render(<App />);


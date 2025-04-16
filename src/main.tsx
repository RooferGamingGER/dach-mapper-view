
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './leaflet.css'  // Add Leaflet CSS import

createRoot(document.getElementById("root")!).render(<App />);

import { useRef, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TabBar } from "@/components/TabBar";
import { Map } from "@/components/Map";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css"; // ← ✅ Muss da stehen, damit Controls gerendert werden


const Index = () => {
  const [activeTab, setActiveTab] = useState("measure");
  const [activeTool, setActiveTool] = useState("");
  const mapRef = useRef<L.Map | null>(null); // zentraler Zugriff auf die Karte

  return (
    <div className="flex flex-col h-screen">
     <Header
          onAddressSelect={(coords) => {
            console.log("Zoom zu:", coords);
        
            // Verzögert, damit DOM sicher gerendert ist
            setTimeout(() => {
              if (mapRef.current) {
                const ZOOM_LEVEL = 17;
                mapRef.current.flyTo([coords[1], coords[0]], ZOOM_LEVEL, {
                  animate: true,
                  duration: 1.5,
                });
        
                // Nochmals nachzeichnen – doppelt hält besser
                setTimeout(() => {
                  mapRef.current?.invalidateSize();
                  console.log("Karte mit invalidateSize aktualisiert.");
                }, 800);
        
                // Optionaler Marker zum Test
                L.marker([coords[1], coords[0]]).addTo(mapRef.current);
              } else {
                console.warn("mapRef ist nicht verfügbar beim Zoom.");
              }
            }, 300); // erste Verzögerung für DOM-Sicherheit
          }}
        />

      
      <TabBar defaultTabId="measure" onChange={setActiveTab} />

      <main className="flex-1 flex overflow-hidden">
        {activeTab === "measure" ? (
          <>
            <Map activeTool={activeTool} mapRef={mapRef} />
          </>
        ) : (
          <div className="flex-1 p-6">
            <h2 className="text-xl font-semibold mb-4">Bericht</h2>
            <p className="text-gray-600">
              Hier werden später Zusammenfassungen und PDFs angezeigt.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Index;

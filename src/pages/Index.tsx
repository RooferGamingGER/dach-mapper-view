import { useRef, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TabBar } from "@/components/TabBar";
import { Toolbar } from "@/components/Toolbar";
import { Map } from "@/components/Map";
import L from "leaflet";

const Index = () => {
  const [activeTab, setActiveTab] = useState("measure");
  const [activeTool, setActiveTool] = useState("");
  const mapRef = useRef<L.Map | null>(null); // zentraler Zugriff auf die Karte

  return (
    <div className="flex flex-col h-screen">
     <Header
        onAddressSelect={(coords) => {
          console.log("Zoom zu:", coords);
          if (mapRef.current) {
            mapRef.current.flyTo([coords[1], coords[0]], 19, {
              animate: true,
              duration: 1.5,
            });
      
            // Nach kurzer Verzögerung: Größe neu berechnen
            setTimeout(() => {
              mapRef.current?.invalidateSize();
              console.log("Karte wurde neu gezeichnet (invalidateSize)");
            }, 500);
      
            // Optional: Testmarker
            L.marker([coords[1], coords[0]]).addTo(mapRef.current);
          } else {
            console.warn("mapRef.current ist null – Karte noch nicht bereit.");
          }
        }}
      />
      
      <TabBar defaultTabId="measure" onChange={setActiveTab} />

      <main className="flex-1 flex overflow-hidden">
        {activeTab === "measure" ? (
          <>
            <Toolbar activeTool={activeTool} onToolSelect={setActiveTool} />
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

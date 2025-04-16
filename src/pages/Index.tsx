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
          setTimeout(() => {
            if (mapRef.current) {
              console.log("Zoom zu:", coords);
              mapRef.current.setView([coords[1], coords[0]], 19);
            } else {
              console.warn("MapRef war noch nicht bereit.");
            }
          }, 300); // 300ms warten
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


import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TabBar } from "@/components/TabBar";
import { Toolbar } from "@/components/Toolbar";
import { Map } from "@/components/Map";

const Index = () => {
  const [activeTab, setActiveTab] = useState("measure");
  const [activeTool, setActiveTool] = useState("");
  
  return (
    <div className="flex flex-col h-screen">
      <Header />
      
      <TabBar defaultTabId="measure" onChange={setActiveTab} />
      
      <main className="flex-1 flex overflow-hidden">
        {activeTab === "measure" ? (
          <>
            {/* Toolbar sidebar */}
            <Toolbar activeTool={activeTool} onToolSelect={setActiveTool} />
            
            {/* Map area */}
            <Map activeTool={activeTool} />
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

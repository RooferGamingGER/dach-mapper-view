
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Home, Save, Download } from "lucide-react";
import { AddressSearch } from "@/components/AddressSearch";


export function Header() {
  return (
    <header className="flex items-center justify-between px-4 py-2 bg-white border-b">
      <div className="flex items-center gap-3">
        <div className="text-app-blue p-1">
          <Home size={24} />
        </div>
        <h1 className="text-xl font-semibold">DACH Digital Viewer</h1>
      </div>
      
      <div className="flex-1 max-w-xl mx-4">
        <div className="relative">
          <Input 
            type="text" 
            placeholder="Adresse suchen..." 
            className="pl-4 pr-4 py-2"
          />
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button className="bg-app-blue hover:bg-blue-600" size="sm">
          <Save className="mr-2 h-4 w-4" />
          Speichern
        </Button>
        <Button className="bg-app-blue hover:bg-blue-600" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Exportieren
        </Button>
      </div>
    </header>
  );
}

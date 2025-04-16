import { useEffect, useState, useRef } from "react";
import { Search, MapPin, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const MAPBOX_TOKEN = "pk.eyJ1Ijoicm9vZmVyZ2FtaW5nIiwiYSI6ImNtOHduem92dTE0dHAya3NldWRuMHVlN2UifQ.p1DH0hDh_k_1fp9HIXoVKQ"; // 👈 HIER deinen echten Token einsetzen

interface AddressSearchProps {
  onSelect: (label: string, coords: [number, number]) => void;
}

export const AddressSearch = ({ onSelect }: AddressSearchProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const searchAddress = async (q: string) => {
    if (q.length < 3) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          q
        )}.json?access_token=${MAPBOX_TOKEN}&limit=5&language=de`
      );
      const data = await res.json();
      setResults(data.features);
    } catch (err) {
      console.error("Adresssuche fehlgeschlagen", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      searchAddress(query);
    }, 300);
    return () => clearTimeout(handler);
  }, [query]);

  const handleSelect = (item: any) => {
    const [lng, lat] = item.center;
    onSelect(item.place_name, [lng, lat]);
    setResults([]);
    setQuery(item.place_name);
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
  };

  return (
    <div className="relative w-full max-w-md" ref={containerRef}>
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Adresse suchen..."
          className="pl-10 pr-10"
        />
        {query && (
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-0 top-0 h-full rounded-l-none"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {results.length > 0 && (
        <ul className="absolute mt-2 w-full bg-white border rounded shadow z-50">
          {results.map((item, i) => (
            <li
              key={i}
              onMouseDown={() => handleSelect(item)}
              className="p-2 cursor-pointer hover:bg-gray-100 flex items-center text-sm"
            >
              <MapPin className="h-4 w-4 mr-2 text-accent" />
              {item.place_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

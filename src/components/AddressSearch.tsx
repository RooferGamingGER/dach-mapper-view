import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, MapPin } from "lucide-react";

const MAPBOX_TOKEN = "pk.eyJ1Ijoicm9vZmVyZ2FtaW5nIiwiYSI6ImNtOHduem92dTE0dHAya3NldWRuMHVlN2UifQ.p1DH0hDh_k_1fp9HIXoVKQ";

interface AddressSearchProps {
  onSelect: (label: string, coords: [number, number]) => void;
}

export const AddressSearch = ({ onSelect }: AddressSearchProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (q: string) => {
    if (q.length < 3) return;
    setLoading(true);
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      q
    )}.json?access_token=${MAPBOX_TOKEN}&language=de&limit=5`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      setResults(data.features);
    } catch (err) {
      console.error("Geocoding failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (item: any) => {
    const [lng, lat] = item.center;
    onSelect(item.place_name, [lng, lat]);
    setQuery(item.place_name);
    setResults([]);
  };

  return (
    <div className="relative w-full z-[1000]" ref={containerRef}>
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Adresse suchen..."
          className="pl-10 pr-10"
          ref={inputRef}
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full rounded-l-none"
            onClick={() => {
              setQuery("");
              setResults([]);
              inputRef.current?.focus();
            }}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {results.length > 0 && (
        <ul className="absolute mt-2 w-full border bg-white shadow-md rounded-md z-[1000] max-h-60 overflow-auto">
          {results.map((result, i) => (
            <li
              key={i}
              onMouseDown={() => handleSelect(result)}
              className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
            >
              <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
              {result.place_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

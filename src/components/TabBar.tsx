
import { useState } from "react";
import { cn } from "@/lib/utils";

type Tab = {
  id: string;
  label: string;
};

interface TabBarProps {
  defaultTabId?: string;
  onChange?: (tabId: string) => void;
}

export function TabBar({ defaultTabId = "measure", onChange }: TabBarProps) {
  const [activeTabId, setActiveTabId] = useState(defaultTabId);
  
  const tabs: Tab[] = [
    { id: "measure", label: "Dach aufmessen" },
    { id: "report", label: "Bericht" },
  ];
  
  const handleTabClick = (tabId: string) => {
    setActiveTabId(tabId);
    if (onChange) onChange(tabId);
  };
  
  return (
    <div className="border-b">
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
              activeTabId === tab.id
                ? "border-app-blue text-app-blue"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            )}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

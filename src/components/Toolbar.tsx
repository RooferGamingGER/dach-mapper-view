
import { Button } from "@/components/ui/button";
import { Square, Undo2, Trash2, Sun, Square as WindowIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Tool = {
  id: string;
  icon: React.ElementType;
  label: string;
};

interface ToolbarProps {
  activeTool?: string;
  onToolSelect?: (toolId: string) => void;
}

export function Toolbar({ activeTool = "", onToolSelect }: ToolbarProps) {
  const tools: Tool[] = [
    { id: "draw", icon: Square, label: "Flächen zeichnen" },
    { id: "undo", icon: Undo2, label: "Rückgängig machen" },
    { id: "delete", icon: Trash2, label: "Löschen" },
    { id: "window", icon: WindowIcon, label: "Dachfenster" },
    { id: "pv", icon: Sun, label: "PV" },
  ];
  
  const handleToolClick = (toolId: string) => {
    if (onToolSelect) onToolSelect(toolId);
  };
  
  return (
    <div className="flex flex-col gap-2 p-2 bg-app-light-gray border-r h-full">
      {tools.map((tool) => {
        const Icon = tool.icon;
        return (
          <Button
            key={tool.id}
            variant="ghost"
            size="icon"
            className={cn(
              "aspect-square p-2 relative group",
              activeTool === tool.id && "bg-white shadow-sm text-app-blue"
            )}
            onClick={() => handleToolClick(tool.id)}
          >
            <Icon size={20} />
            <span className="sr-only">{tool.label}</span>
            
            {/* Tooltip */}
            <span className="absolute left-14 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100 whitespace-nowrap">
              {tool.label}
            </span>
          </Button>
        );
      })}
    </div>
  );
}

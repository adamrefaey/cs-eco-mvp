import React from "react";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function ActionMenu({ actions, onAction, disabled = false }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 hover:bg-white/10"
          disabled={disabled}
        >
          <MoreVertical className="h-4 w-4 text-white/70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-[#1C2233] border-white/20">
        {actions.map((action, index) => (
          <React.Fragment key={action.label}>
            {action.separator && index > 0 && <DropdownMenuSeparator className="bg-white/10" />}
            <DropdownMenuItem
              onClick={() => onAction(action.id)}
              disabled={action.disabled}
              className={`text-white/80 hover:bg-white/10 hover:text-white cursor-pointer ${
                action.danger ? 'text-red-400 hover:text-red-300' : ''
              }`}
            >
              {action.icon && <action.icon className="w-4 h-4 mr-2" />}
              {action.label}
              {action.disabled && (
                <span className="ml-auto text-xs text-white/40">Locked</span>
              )}
            </DropdownMenuItem>
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
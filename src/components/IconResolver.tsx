import * as LucideIcons from "lucide-react";
import React from "react";

export function IconResolver({ 
  iconName, 
  size = 24, 
  color = "currentColor", 
  className = "", 
  strokeWidth 
}: { 
  iconName: string; 
  size?: number | string; 
  color?: string; 
  className?: string; 
  strokeWidth?: number;
}) {
  const IconComponent = (LucideIcons as any)[iconName];

  if (!IconComponent) {
    const Fallback = LucideIcons.HelpCircle;
    return <Fallback size={size} color={color} className={className} strokeWidth={strokeWidth} />;
  }

  return <IconComponent size={size} color={color} className={className} strokeWidth={strokeWidth} />;
}

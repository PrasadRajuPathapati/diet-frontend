import React from "react";

export function ScrollArea({ className = "", children, ...props }) {
  return (
    <div
      className={`overflow-y-auto ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

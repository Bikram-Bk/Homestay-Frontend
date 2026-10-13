"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { cn } from "@/lib/utils";

const Select = SelectPrimitive.Root;
const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex w-full items-center justify-between gap-2 rounded-xl border border-border-warm bg-cream px-4 py-2.5 font-sans text-sm text-brown-deep focus:outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/15 transition-colors placeholder:opacity-40 data-[placeholder]:opacity-40 [&>span]:truncate",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        className="opacity-60 shrink-0"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectContent = React.forwardRef(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 min-w-[8rem] overflow-hidden rounded-xl border border-border-warm bg-card-warm text-brown-deep shadow-xl",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport
        className="p-1.5 max-h-60 overflow-y-auto"
        style={{ scrollbarWidth: "thin" }}
      >
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectItem = React.forwardRef(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-pointer select-none items-center rounded-lg py-2 pl-3 pr-8 font-sans text-sm outline-none transition-colors",
      "focus:bg-terracotta/10 focus:text-brick data-[state=checked]:font-semibold data-[state=checked]:bg-terracotta/10",
      className
    )}
    {...props}
  >
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C4654A" strokeWidth="3">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </SelectPrimitive.ItemIndicator>
    </span>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };

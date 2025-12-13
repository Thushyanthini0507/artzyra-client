"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface PhoneInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, value, onChange, ...props }, ref) => {
    // Extract the number part (remove +94 prefix if present)
    const stringValue = value?.toString() || "";
    const numberPart = stringValue.startsWith("+94") ? stringValue.slice(3) : stringValue.replace(/^\+?94/, "");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Only allow digits, max 9 digits
      const inputValue = e.target.value.replace(/\D/g, "").slice(0, 9);
      
      // Create a synthetic event with the full phone number
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: `+94${inputValue}`,
          name: e.target.name,
        },
      };
      
      // Call the original onChange handler with the modified event
      if (onChange) {
        onChange(syntheticEvent as any);
      }
    };

    return (
      <div className="flex items-center gap-2 w-full">
        <div className="flex items-center justify-center bg-muted text-muted-foreground px-3 h-10 rounded-md border border-input font-medium text-sm min-w-[60px]">
          +94
        </div>
        <Input
          type="tel"
          ref={ref}
          value={numberPart}
          onChange={handleChange}
          placeholder="712345678"
          maxLength={9}
          className={cn("flex-1", className)}
          {...props}
        />
      </div>
    );
  }
);

PhoneInput.displayName = "PhoneInput";

export { PhoneInput };

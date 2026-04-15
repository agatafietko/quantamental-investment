import React from "react";
import { cn } from "../../lib/utils";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-9 w-full border-b border-outline-variant bg-transparent px-0 py-2 text-sm font-serif",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "placeholder:text-ink/50",
        "focus-visible:outline-none focus-visible:border-gold",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };

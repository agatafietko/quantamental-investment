import React from "react";
import { cn } from "../../lib/utils";

const Button = React.forwardRef(({ className, variant = "primary", ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center text-sm transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer";
  
  const variants = {
    primary: "bg-ink-light hover:bg-ink text-white font-serif px-6 py-3",
    primaryGradient: "bg-gradient-ink text-white font-serif px-6 py-3",
    tertiary: "text-gold font-sans font-bold uppercase tracking-widest border-b border-gold hover:border-b-2 hover:pb-[calc(0.75rem-1px)] px-2 py-3"
  };

  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    />
  );
});

Button.displayName = "Button";

export { Button };

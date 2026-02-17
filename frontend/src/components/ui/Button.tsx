import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

const ICON_SIZE = { sm: 16, md: 18 } as const;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: LucideIcon;
  variant?: "primary" | "outline";
  size?: "sm" | "md";
  className?: string;
  children: React.ReactNode;
}

export function Button({
  icon: Icon,
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const iconSize = ICON_SIZE[size];
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none",
        variant === "primary" &&
          "bg-brand-base text-white hover:bg-brand-dark border border-transparent",
        variant === "outline" &&
          "bg-white text-gray-700 border border-gray-300",
        size === "sm" && "px-3 py-1.5 text-sm",
        size === "md" && "px-4 py-2.5 text-sm",
        className,
      )}
      {...props}
    >
      {Icon && <Icon size={iconSize} />}
      {children}
    </button>
  );
}

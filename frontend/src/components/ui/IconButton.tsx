import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  variant?: "default" | "danger";
  className?: string;
}

const ICON_SIZE = 16;

export function IconButton({
  icon: Icon,
  variant = "default",
  className,
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "p-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-200 transition-colors",
        variant === "default" && "text-gray-700",
        variant === "danger" && "text-danger",
        className,
      )}
      {...props}
    >
      <Icon size={ICON_SIZE} />
    </button>
  );
}

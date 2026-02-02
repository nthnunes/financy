import { cn } from "@/lib/cn";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
        variant === "primary" &&
          "bg-primary text-white hover:bg-primary-dark border border-transparent",
        variant === "outline" &&
          "bg-white text-primary border border-primary hover:bg-gray-50",
        variant === "ghost" && "bg-transparent text-gray-700 hover:bg-gray-100",
        size === "sm" && "px-3 py-1.5 text-sm",
        size === "md" && "px-4 py-2.5 text-sm",
        size === "lg" && "px-6 py-3 text-base",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

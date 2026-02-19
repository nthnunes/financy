import { cn } from "@/lib/cn";

interface PaginationButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function PaginationButton({
  isActive = false,
  className,
  children,
  disabled,
  ...props
}: PaginationButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "min-w-[2rem] h-8 px-2 rounded-lg text-sm font-medium transition-colors border",
        "flex items-center justify-center",
        !isActive &&
          !disabled &&
          "bg-[#F7F7F7] text-gray-800 border-gray-200 hover:bg-gray-200 hover:border-gray-200",
        isActive && "bg-brand-base text-white border-brand-base",
        disabled &&
          "bg-[#F7F7F7] text-gray-400 border-gray-200 cursor-not-allowed",
        className,
      )}
      disabled={disabled}
      aria-current={isActive ? "page" : undefined}
      {...props}
    >
      {children}
    </button>
  );
}

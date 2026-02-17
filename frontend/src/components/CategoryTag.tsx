import { getCategoryColorClasses } from "@/lib/categoryOptions";
import { cn } from "@/lib/cn";

interface CategoryTagProps {
  color: string | null;
  children: React.ReactNode;
  className?: string;
}

export function CategoryTag({ color, children, className }: CategoryTagProps) {
  return (
    <span
      className={cn(
        "inline-flex px-3 py-1 rounded-full text-sm font-medium w-fit",
        getCategoryColorClasses(color),
        className,
      )}
    >
      {children}
    </span>
  );
}

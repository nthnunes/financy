import {
  getCategoryIcon,
  getCategoryIconBgClass,
  getCategoryIconColorClass,
} from "@/lib/categoryOptions";

interface CategoryIconProps {
  icon: string;
  color: string;
}

const ICON_SIZE = 16;

export function CategoryIcon({ icon, color }: CategoryIconProps) {
  return (
    <span
      className={`flex items-center justify-center shrink-0 rounded-lg w-10 h-10 ${getCategoryIconBgClass(color)}`}
    >
      {getCategoryIcon(
        icon,
        ICON_SIZE,
        getCategoryIconColorClass(color),
      )}
    </span>
  );
}

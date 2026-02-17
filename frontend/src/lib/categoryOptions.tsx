import {
  Briefcase,
  Car,
  Heart,
  ShoppingCart,
  Tag,
  Gift,
  Utensils,
  Home,
  Ticket,
  TrendingUp,
  CreditCard,
  BookOpen,
  FileText,
  PiggyBank,
  Dumbbell,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  briefcase: Briefcase,
  car: Car,
  heart: Heart,
  shoppingcart: ShoppingCart,
  tag: Tag,
  gift: Gift,
  utensils: Utensils,
  home: Home,
  ticket: Ticket,
  trendingup: TrendingUp,
  creditcard: CreditCard,
  bookopen: BookOpen,
  filetext: FileText,
  piggybank: PiggyBank,
  dumbbell: Dumbbell,
};

export const CATEGORY_ICON_OPTIONS = Object.keys(ICON_MAP);

export const CATEGORY_COLOR_OPTIONS: {
  value: string;
  bgClass: string;
  textClass: string;
  iconClass: string;
  swatchClass: string;
}[] = [
  { value: "green", bgClass: "bg-green-100", textClass: "text-green-800", iconClass: "text-green-600", swatchClass: "bg-green-500" },
  { value: "blue", bgClass: "bg-blue-100", textClass: "text-blue-800", iconClass: "text-blue-600", swatchClass: "bg-blue-500" },
  { value: "purple", bgClass: "bg-purple-100", textClass: "text-purple-800", iconClass: "text-purple-600", swatchClass: "bg-purple-500" },
  { value: "pink", bgClass: "bg-pink-100", textClass: "text-pink-800", iconClass: "text-pink-600", swatchClass: "bg-pink-500" },
  { value: "red", bgClass: "bg-red-100", textClass: "text-red-800", iconClass: "text-red-600", swatchClass: "bg-red-500" },
  { value: "orange", bgClass: "bg-orange-100", textClass: "text-orange-800", iconClass: "text-orange-600", swatchClass: "bg-orange-500" },
  { value: "yellow", bgClass: "bg-yellow-100", textClass: "text-yellow-800", iconClass: "text-yellow-600", swatchClass: "bg-yellow-500" },
  { value: "amber", bgClass: "bg-amber-100", textClass: "text-amber-800", iconClass: "text-amber-600", swatchClass: "bg-amber-500" },
];

export function getCategoryIcon(icon: string | null, size = 20, className = ""): React.ReactNode {
  if (!icon) return null;
  const key = icon.toLowerCase().replace(/-/g, "");
  const IconComponent = ICON_MAP[key];
  if (!IconComponent) return null;
  return <IconComponent size={size} className={className} />;
}

export function getCategoryIconComponent(icon: string | null): LucideIcon | null {
  if (!icon) return null;
  const key = icon.toLowerCase().replace(/-/g, "");
  return ICON_MAP[key] ?? null;
}

export function getCategoryColorClasses(color: string | null): string {
  if (!color) return "bg-gray-100 text-gray-800";
  const opt = CATEGORY_COLOR_OPTIONS.find((c) => c.value === color);
  return opt ? `${opt.bgClass} ${opt.textClass}` : "bg-gray-100 text-gray-800";
}

export function getCategoryIconBgClass(color: string | null): string {
  if (!color) return "bg-gray-100";
  const opt = CATEGORY_COLOR_OPTIONS.find((c) => c.value === color);
  return opt ? opt.bgClass : "bg-gray-100";
}

export function getCategoryIconColorClass(color: string | null): string {
  if (!color) return "text-gray-500";
  const opt = CATEGORY_COLOR_OPTIONS.find((c) => c.value === color);
  return opt ? opt.iconClass : "text-gray-500";
}

export function getCategoryColorSwatchClass(color: string | null): string {
  if (!color) return "bg-gray-400";
  const opt = CATEGORY_COLOR_OPTIONS.find((c) => c.value === color);
  return opt ? opt.swatchClass : "bg-gray-400";
}

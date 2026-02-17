import {
  Briefcase,
  CarFront,
  HeartPulse,
  PiggyBank,
  ShoppingCart,
  Ticket,
  Utensils,
  PawPrint,
  Home,
  Gift,
  Dumbbell,
  BookOpen,
  BaggageClaim,
  Mailbox,
  ReceiptText,
  Tag,
  TrendingUp,
  CreditCard,
  Heart,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  briefcase: Briefcase,
  car: CarFront,
  heartpulse: HeartPulse,
  piggybank: PiggyBank,
  shoppingcart: ShoppingCart,
  ticket: Ticket,
  toolcase: Gift,
  utensils: Utensils,
  paw: PawPrint,
  home: Home,
  gift: Gift,
  dumbbell: Dumbbell,
  bookopen: BookOpen,
  baggageclaim: BaggageClaim,
  mailbox: Mailbox,
  receipttext: ReceiptText,
  tag: Tag,
  trendingup: TrendingUp,
  creditcard: CreditCard,
  heart: Heart,
};

/** Ordem da grade: 8 ícones por linha (como no Figma) */
export const CATEGORY_ICON_OPTIONS = [
  "briefcase",
  "car",
  "heartpulse",
  "piggybank",
  "shoppingcart",
  "ticket",
  "toolcase",
  "utensils",
  "paw",
  "home",
  "gift",
  "dumbbell",
  "bookopen",
  "baggageclaim",
  "mailbox",
  "receipttext",
];

export const CATEGORY_COLOR_OPTIONS: {
  value: string;
  bgClass: string;
  textClass: string;
  iconClass: string;
  swatchClass: string;
}[] = [
  {
    value: "green",
    bgClass: "bg-green-100",
    textClass: "text-green-800",
    iconClass: "text-green-600",
    swatchClass: "bg-green-500",
  },
  {
    value: "blue",
    bgClass: "bg-blue-100",
    textClass: "text-blue-800",
    iconClass: "text-blue-600",
    swatchClass: "bg-blue-500",
  },
  {
    value: "purple",
    bgClass: "bg-purple-100",
    textClass: "text-purple-800",
    iconClass: "text-purple-600",
    swatchClass: "bg-purple-500",
  },
  {
    value: "pink",
    bgClass: "bg-pink-100",
    textClass: "text-pink-800",
    iconClass: "text-pink-600",
    swatchClass: "bg-pink-500",
  },
  {
    value: "red",
    bgClass: "bg-red-100",
    textClass: "text-red-800",
    iconClass: "text-red-600",
    swatchClass: "bg-red-500",
  },
  {
    value: "orange",
    bgClass: "bg-orange-100",
    textClass: "text-orange-800",
    iconClass: "text-orange-600",
    swatchClass: "bg-orange-500",
  },
  {
    value: "yellow",
    bgClass: "bg-yellow-100",
    textClass: "text-yellow-800",
    iconClass: "text-yellow-600",
    swatchClass: "bg-yellow-500",
  },
  {
    value: "amber",
    bgClass: "bg-amber-100",
    textClass: "text-amber-800",
    iconClass: "text-amber-600",
    swatchClass: "bg-amber-500",
  },
];

export function getCategoryIcon(
  icon: string | null,
  size = 20,
  className = "",
): React.ReactNode {
  if (!icon) return null;
  const key = icon.toLowerCase().replace(/-/g, "");
  const IconComponent = ICON_MAP[key];
  if (!IconComponent) return null;
  return <IconComponent size={size} className={className} />;
}

export function getCategoryIconComponent(
  icon: string | null,
): LucideIcon | null {
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

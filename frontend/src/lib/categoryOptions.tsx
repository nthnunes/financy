import {
  Briefcase,
  CarFront,
  HeartPulse,
  PiggyBank,
  ShoppingCart,
  Ticket,
  ToolCase,
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
  toolcase: ToolCase,
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
    bgClass: "bg-green-light",
    textClass: "text-green-dark",
    iconClass: "text-green-base",
    swatchClass: "bg-green-base",
  },
  {
    value: "blue",
    bgClass: "bg-blue-light",
    textClass: "text-blue-dark",
    iconClass: "text-blue-base",
    swatchClass: "bg-blue-base",
  },
  {
    value: "purple",
    bgClass: "bg-purple-light",
    textClass: "text-purple-dark",
    iconClass: "text-purple-base",
    swatchClass: "bg-purple-base",
  },
  {
    value: "pink",
    bgClass: "bg-pink-light",
    textClass: "text-pink-dark",
    iconClass: "text-pink-base",
    swatchClass: "bg-pink-base",
  },
  {
    value: "red",
    bgClass: "bg-red-light",
    textClass: "text-red-dark",
    iconClass: "text-red-base",
    swatchClass: "bg-red-base",
  },
  {
    value: "orange",
    bgClass: "bg-orange-light",
    textClass: "text-orange-dark",
    iconClass: "text-orange-base",
    swatchClass: "bg-orange-base",
  },
  {
    value: "yellow",
    bgClass: "bg-yellow-light",
    textClass: "text-yellow-dark",
    iconClass: "text-yellow-base",
    swatchClass: "bg-yellow-base",
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

import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";
import { IconButton } from "@/components/ui/IconButton";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export function Dialog({
  open,
  onClose,
  title,
  subtitle,
  children,
  className,
}: DialogProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      onClick={onClose}
    >
      <div
        className={cn(
          "bg-white rounded-xl w-full max-w-md overflow-auto",
          className,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between px-6 pt-6 border-b border-gray-100">
          <div className="flex flex-col gap-0.5">
            <h2 id="dialog-title" className="font-semibold text-gray-800">
              {title}
            </h2>
            {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
          </div>
          <IconButton icon={X} onClick={onClose} aria-label="Fechar" />
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

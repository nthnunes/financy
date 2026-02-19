import { forwardRef, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, ChevronUp, Check } from "lucide-react";
import { cn } from "@/lib/cn";

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface SelectProps {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  value?: string;
  defaultValue?: string;
  name?: string;
  onChange?: (e: { target: { value: string } }) => void;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  disabled?: boolean;
}

export const Select = forwardRef<HTMLInputElement, SelectProps>(
  (
    {
      label,
      error,
      options,
      placeholder,
      className,
      value: controlledValue,
      defaultValue,
      name,
      onChange,
      onBlur,
      disabled,
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [uncontrolledValue, setUncontrolledValue] = useState(
      defaultValue ?? "",
    );
    const [dropdownRect, setDropdownRect] = useState<{
      top: number;
      left: number;
      width: number;
    } | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : uncontrolledValue;
    const selectedOption = options.find((opt) => opt.value === value);

    useEffect(() => {
      if (!isOpen) {
        setDropdownRect(null);
        return;
      }
      const trigger = triggerRef.current;
      if (trigger) {
        const rect = trigger.getBoundingClientRect();
        setDropdownRect({
          top: rect.bottom + 8, // gap-2 entre select e dropdown
          left: rect.left,
          width: rect.width,
        });
      }
      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as Node;
        const inTrigger = containerRef.current?.contains(target);
        const inDropdown = dropdownRef.current?.contains(target);
        if (!inTrigger && !inDropdown) setIsOpen(false);
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    const handleSelect = (optionValue: string) => {
      if (!isControlled) setUncontrolledValue(optionValue);
      onChange?.({ target: { value: optionValue } });
      setIsOpen(false);
    };

    return (
      <div className="w-full" ref={containerRef}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        <input
          type="hidden"
          ref={ref}
          name={name}
          value={value}
          onBlur={onBlur}
          readOnly
          aria-hidden
        />
        <div className="relative">
          <button
            ref={triggerRef}
            type="button"
            disabled={disabled}
            onClick={() => setIsOpen((prev) => !prev)}
            className={cn(
              "w-full flex items-center gap-3 rounded-lg border border-gray-300 bg-white px-3 py-3.5 text-left text-gray-900 transition-colors",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500",
              disabled && "cursor-not-allowed opacity-60",
              className,
            )}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-label={label ?? "Seleção"}
          >
            {selectedOption?.icon && (
              <span className="flex shrink-0 text-gray-400">
                {selectedOption.icon}
              </span>
            )}
            <span className="min-w-0 flex-1 truncate">
              {selectedOption
                ? selectedOption.label
                : (placeholder ?? "Selecione")}
            </span>
            <span className="shrink-0 text-gray-500">
              {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </span>
          </button>

          {isOpen &&
            dropdownRect &&
            typeof document !== "undefined" &&
            createPortal(
              <div
                ref={dropdownRef}
                role="listbox"
                className="fixed z-[100] flex flex-col gap-4 rounded-lg border border-gray-300 bg-white px-3 py-3.5 shadow-[0_4px_15px_0_rgba(0,0,0,0.1)] overflow-y-auto"
                style={{
                  top: dropdownRect.top,
                  left: dropdownRect.left,
                  width: dropdownRect.width,
                  maxHeight:
                    typeof window !== "undefined"
                      ? `${Math.max(120, window.innerHeight - dropdownRect.top - 24)}px`
                      : undefined,
                }}
              >
                {placeholder && (
                  <button
                    type="button"
                    role="option"
                    aria-selected={!value}
                    onClick={() => handleSelect("")}
                    className={cn(
                      "w-full flex items-center justify-between gap-2 py-2 text-left text-gray-700",
                      !value && "font-semibold bg-gray-50",
                    )}
                  >
                    <span>{placeholder}</span>
                    {!value && (
                      <Check
                        size={20}
                        className="shrink-0 text-feedback-success"
                      />
                    )}
                  </button>
                )}
                {options.map((opt) => {
                  const isSelected = opt.value === value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleSelect(opt.value)}
                      className={cn(
                        "w-full flex items-center justify-between gap-2 text-left text-gray-800",
                        isSelected && "font-medium",
                      )}
                    >
                      <span className="flex items-center gap-2 truncate">
                        {opt.icon && (
                          <span className="flex shrink-0 text-gray-400">
                            {opt.icon}
                          </span>
                        )}
                        {opt.label}
                      </span>
                      {isSelected && (
                        <Check
                          size={18}
                          className="shrink-0 text-green-600"
                          strokeWidth={2.5}
                        />
                      )}
                    </button>
                  );
                })}
              </div>,
              document.body,
            )}
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  },
);
Select.displayName = "Select";

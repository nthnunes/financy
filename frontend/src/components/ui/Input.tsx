import { forwardRef, useState, useCallback } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

const INPUT_ICON_SIZE = 16;

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: LucideIcon;
  rightIcon?: React.ReactNode;
  className?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      icon: Icon,
      rightIcon,
      className,
      value,
      defaultValue,
      onFocus,
      onBlur,
      onChange,
      disabled,
      ...props
    },
    ref,
  ) => {
    const [focused, setFocused] = useState(false);
    const [internalValue, setInternalValue] = useState(() =>
      String(defaultValue ?? ""),
    );
    const isControlled = value !== undefined;
    const currentValue = isControlled ? String(value ?? "") : internalValue;
    const hasValue = currentValue.trim().length > 0;

    const handleFocus = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        setFocused(true);
        onFocus?.(e);
      },
      [onFocus],
    );
    const handleBlur = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        setFocused(false);
        onBlur?.(e);
      },
      [onBlur],
    );
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isControlled) setInternalValue(e.target.value);
        onChange?.(e);
      },
      [onChange, isControlled],
    );

    const isActive = focused && !disabled && !error;
    const isFilled = hasValue && !focused && !disabled && !error;
    const isError = Boolean(error);
    const isDisabled = Boolean(disabled);

    const labelClassName = cn(
      "block text-sm font-medium mb-2 transition-colors",
      isError && "text-red-500",
      isActive && !isError && "text-brand-base",
      !isError && !isActive && "text-gray-900",
    );

    const iconClassName = cn(
      "transition-colors",
      isDisabled && "text-gray-400",
      isError && "text-red-500",
      isActive && !isError && "text-brand-base",
      isFilled && !isError && "text-gray-900",
      !isFilled && !isActive && !isError && !isDisabled && "text-gray-400",
    );

    const inputClassName = cn(
      "w-full rounded-lg border py-3.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-0 transition-colors",
      Icon && "pl-10",
      rightIcon && "pr-10",
      !Icon && !rightIcon && "px-4",
      isDisabled &&
        "border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed placeholder-gray-400",
      !isDisabled && "bg-white",
      !isError && "border-gray-300",
    );

    const displayHelper = error ?? helperText;
    const helperClassName = cn("mt-1 text-sm text-gray-500");

    return (
      <div className="w-full">
        {label && (
          <label className={labelClassName} htmlFor={props.id}>
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute left-3 top-1/2 flex -translate-y-1/2 items-center justify-center">
              <Icon size={INPUT_ICON_SIZE} className={iconClassName} />
            </div>
          )}
          <input
            {...props}
            ref={ref}
            value={isControlled ? value : undefined}
            defaultValue={isControlled ? undefined : defaultValue}
            className={cn(inputClassName, className)}
            disabled={disabled}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center [&>svg]:size-5">
              {rightIcon}
            </div>
          )}
        </div>
        {displayHelper && (
          <p className={helperClassName} role={isError ? "alert" : undefined}>
            {displayHelper}
          </p>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

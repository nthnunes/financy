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

    const wrapperClassName = cn(
      "flex items-center gap-3 rounded-lg border px-3 py-3.5 transition-colors",
      isDisabled && "border-gray-300 bg-gray-100 cursor-not-allowed",
      !isDisabled && "bg-white",
      isError && "border-red-500",
      !isError && "border-gray-300",
    );

    const inputClassName = cn(
      "min-w-0 flex-1 border-0 bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-0",
      isDisabled && "cursor-not-allowed text-gray-500 placeholder-gray-400",
      className,
    );

    const displayHelper = error ?? helperText;
    const helperClassName = cn("mt-2 text-sm text-gray-500");

    return (
      <div className="w-full">
        {label && (
          <label className={labelClassName} htmlFor={props.id}>
            {label}
          </label>
        )}
        <div className={wrapperClassName}>
          {Icon && (
            <Icon
              size={INPUT_ICON_SIZE}
              className={cn("shrink-0", iconClassName)}
            />
          )}
          <input
            {...props}
            ref={ref}
            value={isControlled ? value : undefined}
            defaultValue={isControlled ? undefined : defaultValue}
            className={inputClassName}
            disabled={disabled}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
          />
          {rightIcon && (
            <div className="shrink-0 [&>svg]:size-4">{rightIcon}</div>
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

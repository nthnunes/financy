import { forwardRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  "children"
> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              "w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-4 pr-10 text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary appearance-none",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500",
              className,
            )}
            {...props}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
            <ChevronDown size={20} strokeWidth={2} />
          </div>
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  },
);
Select.displayName = "Select";

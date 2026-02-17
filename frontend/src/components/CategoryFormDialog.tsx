import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  useCreateCategory,
  useUpdateCategory,
  type Category,
} from "@/hooks/useCategories";
import {
  CATEGORY_ICON_OPTIONS,
  CATEGORY_COLOR_OPTIONS,
  getCategoryIconComponent,
} from "@/lib/categoryOptions";
import { cn } from "@/lib/cn";

const schema = z.object({
  name: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
  icon: z.string().min(1, "Ícone é obrigatório"),
  color: z.string().min(1, "Cor é obrigatória"),
});

type FormData = z.infer<typeof schema>;

interface CategoryFormDialogProps {
  open: boolean;
  onClose: () => void;
  edit?: Category | null;
}

export function CategoryFormDialog({
  open,
  onClose,
  edit,
}: CategoryFormDialogProps) {
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      icon: CATEGORY_ICON_OPTIONS[0] ?? "",
      color: CATEGORY_COLOR_OPTIONS[0]?.value ?? "",
    },
  });

  const selectedIcon = watch("icon");
  const selectedColor = watch("color");

  useEffect(() => {
    if (open && edit) {
      reset({
        name: edit.name,
        description: edit.description ?? "",
        icon: edit.icon,
        color: edit.color,
      });
    } else if (open && !edit) {
      reset({
        name: "",
        description: "",
        icon: CATEGORY_ICON_OPTIONS[0] ?? "",
        color: CATEGORY_COLOR_OPTIONS[0]?.value ?? "",
      });
    }
  }, [open, edit, reset]);

  const onSubmit = (data: FormData) => {
    const payload = {
      name: data.name,
      description: data.description || null,
      icon: data.icon,
      color: data.color,
    };
    if (edit) {
      updateCategory.mutate(
        { id: edit.id, input: payload },
        {
          onSuccess: () => {
            reset();
            onClose();
          },
        },
      );
    } else {
      createCategory.mutate(payload, {
        onSuccess: () => {
          reset();
          onClose();
        },
      });
    }
  };

  if (!open) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={edit ? "Editar categoria" : "Nova categoria"}
      subtitle="Organize suas transações com categorias"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Título"
          placeholder="Ex. Alimentação"
          error={errors.name?.message}
          {...register("name")}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descrição
          </label>
          <p className="text-xs text-gray-500 mb-1">Opcional</p>
          <input
            type="text"
            placeholder="Descrição da categoria"
            className="w-full rounded-lg border border-gray-300 bg-white py-2.5 px-3 text-gray-900 placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            {...register("description")}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ícone
          </label>
          <div className="grid grid-cols-6 gap-2">
            {CATEGORY_ICON_OPTIONS.map((iconKey) => {
              const IconComponent = getCategoryIconComponent(iconKey);
              const isSelected = selectedIcon === iconKey;
              const iconColorClass =
                CATEGORY_COLOR_OPTIONS.find((c) => c.value === (selectedColor ?? null))
                  ?.iconClass ?? "text-gray-600";
              return (
                <button
                  key={iconKey}
                  type="button"
                  onClick={() => setValue("icon", iconKey)}
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center border-2 transition-colors",
                    isSelected
                      ? "border-primary bg-primary/10"
                      : "border-transparent bg-gray-100 hover:bg-gray-200",
                  )}
                  aria-label={`Ícone ${iconKey}`}
                >
                  {IconComponent ? (
                    <IconComponent size={20} className={iconColorClass} />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cor
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_COLOR_OPTIONS.map((opt) => {
              const isSelected = selectedColor === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setValue("color", opt.value)}
                  className={cn(
                    "w-8 h-8 rounded-lg border-2 transition-colors",
                    opt.swatchClass,
                    isSelected ? "ring-2 ring-offset-2 ring-primary border-primary" : "border-transparent",
                  )}
                  aria-label={`Cor ${opt.value}`}
                />
              );
            })}
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={createCategory.isPending || updateCategory.isPending}
        >
          Salvar
        </Button>
        {(createCategory.isError || updateCategory.isError) && (
          <p className="text-sm text-red-500 text-center">
            {(() => {
              const err = createCategory.error ?? updateCategory.error;
              return err instanceof Error ? err.message : "Erro ao salvar";
            })()}
          </p>
        )}
      </form>
    </Dialog>
  );
}

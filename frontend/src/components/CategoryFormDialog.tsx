import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
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

        <Input
          label="Descrição"
          placeholder="Descrição da categoria"
          helperText="Opcional"
          error={errors.description?.message}
          {...register("description")}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ícone
          </label>
          <div className="grid grid-cols-8 gap-2">
            {CATEGORY_ICON_OPTIONS.map((iconKey) => {
              const IconComponent = getCategoryIconComponent(iconKey);
              const isSelected = selectedIcon === iconKey;
              if (!IconComponent) return null;
              return (
                <IconButton
                  key={iconKey}
                  icon={IconComponent}
                  onClick={() => setValue("icon", iconKey)}
                  aria-label={`Ícone ${iconKey}`}
                  className={cn(
                    "w-10 h-10 flex items-center justify-center hover:bg-gray-100",
                    isSelected ? "border-brand-base" : "",
                  )}
                />
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cor
          </label>
          <div className="flex w-full gap-2">
            {CATEGORY_COLOR_OPTIONS.map((opt) => {
              const isSelected = selectedColor === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setValue("color", opt.value)}
                  className={cn(
                    "flex-1 min-w-0 rounded-lg border-2 p-1 transition-colors",
                    isSelected
                      ? "border-brand-base"
                      : "border-gray-200 hover:border-gray-300",
                  )}
                  aria-label={`Cor ${opt.value}`}
                >
                  <div
                    className={cn("h-6 w-full rounded-[4px]", opt.swatchClass)}
                  />
                </button>
              );
            })}
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          className="w-full"
          disabled={createCategory.isPending || updateCategory.isPending}
        >
          Salvar
        </Button>
        {(createCategory.isError || updateCategory.isError) && (
          <p className="text-sm text-danger text-center">
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

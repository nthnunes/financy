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

const schema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
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
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "" },
  });

  useEffect(() => {
    if (open && edit) {
      reset({ name: edit.name });
    } else if (open && !edit) {
      reset({ name: "" });
    }
  }, [open, edit, reset]);

  const onSubmit = (data: FormData) => {
    if (edit) {
      updateCategory.mutate(
        { id: edit.id, input: { name: data.name } },
        {
          onSuccess: () => {
            reset();
            onClose();
          },
        },
      );
    } else {
      createCategory.mutate(
        { name: data.name },
        {
          onSuccess: () => {
            reset();
            onClose();
          },
        },
      );
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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Nome"
          placeholder="Ex. Alimentação"
          error={errors.name?.message}
          {...register("name")}
        />
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
            {(createCategory.error || updateCategory.error) instanceof Error
              ? (createCategory.error || updateCategory.error).message
              : "Erro ao salvar"}
          </p>
        )}
      </form>
    </Dialog>
  );
}

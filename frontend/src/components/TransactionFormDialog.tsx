import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CircleArrowDown, CircleArrowUp } from "lucide-react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useCategories } from "@/hooks/useCategories";
import {
  useCreateTransaction,
  useUpdateTransaction,
  type Transaction,
} from "@/hooks/useTransactions";
import { cn } from "@/lib/cn";

const schema = z.object({
  title: z.string().min(1, "Descrição é obrigatória"),
  amount: z.number().min(0, "Valor deve ser positivo"),
  type: z.enum(["income", "expense"]),
  date: z.string().min(1, "Data é obrigatória"),
  categoryId: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface TransactionFormDialogProps {
  open: boolean;
  onClose: () => void;
  edit?: Transaction | null;
}

function formatAmountForInput(value: number) {
  if (value === 0) return "";
  return value.toFixed(2).replace(".", ",");
}

function parseAmountFromInput(str: string): number {
  const cleaned = str.replace(/\./g, "").replace(",", ".");
  return parseFloat(cleaned) || 0;
}

export function TransactionFormDialog({
  open,
  onClose,
  edit,
}: TransactionFormDialogProps) {
  const { data: categories = [] } = useCategories();
  const createTransaction = useCreateTransaction();
  const updateTransaction = useUpdateTransaction();

  const categoryOptions: { value: string; label: string }[] = categories.map(
    (c) => ({
      value: c.id,
      label: c.name,
    }),
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: "expense",
      title: "",
      amount: 0,
      date: new Date().toISOString().slice(0, 10),
      categoryId: "",
    },
  });

  const type = watch("type");
  const categoryId = watch("categoryId");

  const onSubmit = (data: FormData) => {
    const payload = {
      title: data.title,
      amount: data.amount,
      type: data.type,
      date: new Date(data.date).toISOString(),
      categoryId: data.categoryId || null,
    };
    if (edit) {
      updateTransaction.mutate(
        {
          id: edit.id,
          input: payload,
        },
        {
          onSuccess: () => {
            reset();
            onClose();
          },
        },
      );
    } else {
      createTransaction.mutate(payload, {
        onSuccess: () => {
          reset();
          onClose();
        },
      });
    }
  };

  useEffect(() => {
    if (open && edit) {
      reset({
        type: edit.type as "income" | "expense",
        title: edit.title,
        amount: edit.amount,
        date: edit.date.slice(0, 10),
        categoryId: edit.categoryId || "",
      });
    } else if (open && !edit) {
      reset({
        type: "expense",
        title: "",
        amount: 0,
        date: new Date().toISOString().slice(0, 10),
        categoryId: "",
      });
    }
  }, [open, edit, reset]);

  if (!open) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={edit ? "Editar transação" : "Nova transação"}
      subtitle="Registre sua despesa ou receita"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex border border-gray-200 rounded-xl p-2">
          <Button
            type="button"
            variant="outline"
            size="md"
            icon={CircleArrowDown}
            iconClassName={cn(
              type === "expense" ? "text-red-base" : "text-gray-400",
            )}
            className={cn(
              "flex-1 transition-colors hover:bg-gray-100",
              type === "expense"
                ? "border-red-base text-gray-800"
                : "border-transparent text-gray-400",
            )}
            onClick={() => setValue("type", "expense")}
          >
            Despesa
          </Button>
          <Button
            type="button"
            variant="outline"
            size="md"
            icon={CircleArrowUp}
            iconClassName={cn(
              type === "income" ? "text-brand-base" : "text-gray-400",
            )}
            className={cn(
              "flex-1 transition-colors hover:bg-gray-100",
              type === "income"
                ? "border-brand-base text-gray-800"
                : "border-transparent text-gray-400",
            )}
            onClick={() => setValue("type", "income")}
          >
            Receita
          </Button>
        </div>

        <input type="hidden" {...register("type")} />

        <Input
          label="Descrição"
          placeholder="Ex. Almoço no restaurante"
          error={errors.title?.message}
          {...register("title")}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Data"
            placeholder="Selecione"
            type="date"
            error={errors.date?.message}
            {...register("date")}
          />
          <Input
            label="Valor"
            placeholder="R$ 0,00"
            error={errors.amount?.message}
            value={formatAmountForInput(watch("amount"))}
            onChange={(e) =>
              setValue("amount", parseAmountFromInput(e.target.value), {
                shouldValidate: true,
              })
            }
          />
        </div>

        <Select
          label="Categoria"
          placeholder="Selecione"
          options={categoryOptions}
          value={categoryId ?? ""}
          onChange={(e) =>
            setValue("categoryId", e.target.value, { shouldValidate: true })
          }
          onBlur={register("categoryId").onBlur}
          name={register("categoryId").name}
          error={errors.categoryId?.message}
        />

        <Button
          type="submit"
          variant="primary"
          size="md"
          className="w-full"
          disabled={createTransaction.isPending || updateTransaction.isPending}
        >
          Salvar
        </Button>
        {(createTransaction.isError || updateTransaction.isError) && (
          <p className="text-sm text-red-500 text-center">
            {(() => {
              const err = createTransaction.error || updateTransaction.error;
              return err instanceof Error ? err.message : "Erro ao salvar";
            })()}
          </p>
        )}
      </form>
    </Dialog>
  );
}

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowDown, ArrowUp } from "lucide-react";
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
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setValue("type", "expense")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 font-medium transition-colors",
              type === "expense"
                ? "border-red-500 text-red-600 bg-red-50"
                : "border-gray-200 text-gray-600 hover:border-gray-300",
            )}
          >
            <ArrowDown size={20} strokeWidth={2.5} />
            Despesa
          </button>
          <button
            type="button"
            onClick={() => setValue("type", "income")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 font-medium transition-colors",
              type === "income"
                ? "border-primary text-primary bg-green-50"
                : "border-gray-200 text-gray-600 hover:border-gray-300",
            )}
          >
            <ArrowUp size={20} strokeWidth={2.5} />
            Receita
          </button>
        </div>

        <input type="hidden" {...register("type")} />

        <Input
          label="Descrição"
          placeholder="Ex. Almoço no restaurante"
          error={errors.title?.message}
          {...register("title")}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data
          </label>
          <input
            type="date"
            className="w-full rounded-lg border border-gray-300 bg-white py-2.5 px-4 text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            {...register("date")}
          />
          {errors.date?.message && (
            <p className="mt-1 text-sm text-red-500">{errors.date.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Valor
          </label>
          <input
            key={edit?.id ?? "new"}
            type="text"
            placeholder="R$ 0,00"
            className="w-full rounded-lg border border-gray-300 bg-white py-2.5 px-4 text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            defaultValue={edit ? formatAmountForInput(edit.amount) : ""}
            onChange={(e) => {
              const v = parseAmountFromInput(e.target.value);
              setValue("amount", v, { shouldValidate: true });
            }}
          />
          {errors.amount?.message && (
            <p className="mt-1 text-sm text-red-500">{errors.amount.message}</p>
          )}
        </div>

        <Select
          label="Categoria"
          placeholder="Selecione"
          options={categoryOptions}
          value={categoryId ?? ""}
          onChange={(e) => setValue("categoryId", e.target.value, { shouldValidate: true })}
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
            {(createTransaction.error || updateTransaction.error) instanceof
            Error
              ? (createTransaction.error || updateTransaction.error).message
              : "Erro ao salvar"}
          </p>
        )}
      </form>
    </Dialog>
  );
}

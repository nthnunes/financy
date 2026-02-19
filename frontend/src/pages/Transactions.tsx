import { useState, useMemo } from "react";
import {
  Plus,
  Search,
  SquarePen,
  Trash,
  CircleArrowDown,
  CircleArrowUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { TransactionFormDialog } from "@/components/TransactionFormDialog";
import { useTransactions, type Transaction } from "@/hooks/useTransactions";
import { useCategories } from "@/hooks/useCategories";
import { useDeleteTransaction } from "@/hooks/useTransactions";
import { CategoryIcon } from "@/components/CategoryIcon";
import { CategoryTag } from "@/components/CategoryTag";
import { cn } from "@/lib/cn";

const PAGE_SIZE = 10;

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

function formatCurrency(value: number, type: string) {
  const n = value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return type === "income" ? `+ R$ ${n}` : `- R$ ${n}`;
}

const MONTH_NAMES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

function buildPeriodOptions() {
  const options = [{ value: "all", label: "Todos" }];
  const now = new Date();
  for (let i = 0; i < 24; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = `${MONTH_NAMES[d.getMonth()]} / ${d.getFullYear()}`;
    options.push({ value, label });
  }
  return options;
}

const periodOptions = buildPeriodOptions();

export default function Transactions() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState(periodOptions[1].value);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const { data: transactions = [], isLoading } = useTransactions();
  const { data: categories = [] } = useCategories();
  const deleteTransaction = useDeleteTransaction();

  const categoryOptions = [
    { value: "all", label: "Todas" },
    ...categories.map((c) => ({ value: c.id, label: c.name })),
  ];

  const typeOptions = [
    { value: "all", label: "Todos" },
    { value: "income", label: "Entrada" },
    { value: "expense", label: "Saída" },
  ];

  const filtered = useMemo(() => {
    let list = transactions;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((t) => t.title.toLowerCase().includes(q));
    }
    if (typeFilter !== "all") {
      list = list.filter((t) => t.type === typeFilter);
    }
    if (categoryFilter !== "all") {
      list = list.filter((t) => t.categoryId === categoryFilter);
    }
    if (periodFilter !== "all") {
      list = list.filter((t) => {
        const [y, m] = t.date.split("T")[0].split("-");
        return `${y}-${m}` === periodFilter;
      });
    }
    return list;
  }, [transactions, search, typeFilter, categoryFilter, periodFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const openEdit = (t: Transaction) => {
    setEditing(t);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Transações</h1>
          <p className="text-gray-500 mt-0.5">
            Gerencie todas as suas transações financeiras
          </p>
        </div>
        <Button icon={Plus} size="sm" onClick={openCreate}>
          Nova transação
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Input
                label="Buscar"
                placeholder="Buscar por descrição"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                icon={Search}
              />
            </div>
            <div>
              <Select
                label="Tipo"
                options={typeOptions}
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <div>
              <Select
                label="Categoria"
                options={categoryOptions}
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <div>
              <Select
                label="Período"
                options={periodOptions}
                value={periodFilter}
                onChange={(e) => {
                  setPeriodFilter(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Carregando...</div>
          ) : paginated.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Nenhuma transação encontrada.
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 text-left text-xs font-medium uppercase text-gray-500 tracking-wider">
                  <th className="px-6 py-5">Descrição</th>
                  <th className="px-6 py-5 text-center">Data</th>
                  <th className="px-6 py-5 text-center">Categoria</th>
                  <th className="px-6 py-5 text-center">Tipo</th>
                  <th className="px-6 py-5 text-right">Valor</th>
                  <th className="px-6 py-5 w-24">Ações</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((t) => (
                  <tr key={t.id} className="border-b border-gray-200">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <CategoryIcon
                          icon={t.category!.icon}
                          color={t.category!.color}
                        />
                        <span className="font-medium text-gray-800">
                          {t.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600">
                      {formatDate(t.date)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <CategoryTag color={t.category?.color ?? null}>
                        {t.category?.name ?? "-"}
                      </CategoryTag>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={cn(
                          "inline-flex items-center gap-2 text-sm font-medium",
                          t.type === "income"
                            ? "text-green-dark"
                            : "text-red-dark",
                        )}
                      >
                        {t.type === "income" ? (
                          <>
                            <CircleArrowUp size={16} />
                            Entrada
                          </>
                        ) : (
                          <>
                            <CircleArrowDown size={16} />
                            Saída
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-sm text-right text-gray-800">
                      {formatCurrency(t.amount, t.type)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <IconButton
                          icon={Trash}
                          variant="danger"
                          onClick={() => {
                            if (window.confirm("Excluir esta transação?")) {
                              deleteTransaction.mutate(t.id);
                            }
                          }}
                          aria-label="Excluir"
                        />
                        <IconButton
                          icon={SquarePen}
                          variant="default"
                          onClick={() => openEdit(t)}
                          aria-label="Editar"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {filtered.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-100">
              <p className="text-sm text-gray-700">
                <span className="font-medium">
                  {PAGE_SIZE * (page - 1) + 1}
                </span>{" "}
                a{" "}
                <span className="font-medium">
                  {Math.min(PAGE_SIZE * page, filtered.length)}
                </span>{" "}
                | {filtered.length}{" "}
                {filtered.length === 1 ? "resultado" : "resultados"}
              </p>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                >
                  &lt;
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (n) => (
                    <Button
                      key={n}
                      variant={n === page ? "primary" : "outline"}
                      size="sm"
                      onClick={() => setPage(n)}
                    >
                      {n}
                    </Button>
                  ),
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                >
                  &gt;
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <TransactionFormDialog
        open={modalOpen}
        onClose={closeModal}
        edit={editing}
      />
    </div>
  );
}

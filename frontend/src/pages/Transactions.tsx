import { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  ArrowDown,
  ArrowUp,
  Tag,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { TransactionFormDialog } from "@/components/TransactionFormDialog";
import { useTransactions, type Transaction } from "@/hooks/useTransactions";
import { useCategories } from "@/hooks/useCategories";
import { useDeleteTransaction } from "@/hooks/useTransactions";
import {
  getCategoryIcon,
  getCategoryIconBgClass,
  getCategoryColorClasses,
  getCategoryIconColorClass,
} from "@/lib/categoryOptions";
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
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
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
    <div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transações</h1>
          <p className="text-gray-500 mt-1">
            Gerencie todas as suas transações financeiras
          </p>
        </div>
        <Button variant="primary" size="md" onClick={openCreate}>
          <Plus size={20} strokeWidth={2.5} />
          Nova transação
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buscar
              </label>
              <Input
                placeholder="Buscar por descrição"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                icon={<Search size={20} />}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo
              </label>
              <Select
                options={typeOptions}
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoria
              </label>
              <Select
                options={categoryOptions}
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Período
              </label>
              <Select
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
                <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-medium uppercase text-gray-500 tracking-wider">
                  <th className="px-6 py-4">Descrição</th>
                  <th className="px-6 py-4">Data</th>
                  <th className="px-6 py-4">Categoria</th>
                  <th className="px-6 py-4">Tipo</th>
                  <th className="px-6 py-4">Valor</th>
                  <th className="px-6 py-4 w-24">Ações</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((t) => (
                  <tr
                    key={t.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                            getCategoryIconBgClass(t.category?.color ?? null),
                          )}
                        >
                          {getCategoryIcon(
                            t.category?.icon ?? null,
                            18,
                            getCategoryIconColorClass(
                              t.category?.color ?? null,
                            ),
                          ) ?? <Tag size={18} className="text-gray-500" />}
                        </span>
                        <span className="font-medium text-gray-900">
                          {t.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {formatDate(t.date)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium",
                          getCategoryColorClasses(t.category?.color ?? null),
                        )}
                      >
                        {t.category?.name ?? "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 text-sm font-medium",
                          t.type === "income"
                            ? "text-green-600"
                            : "text-red-600",
                        )}
                      >
                        {t.type === "income" ? (
                          <>
                            <ArrowUp size={16} strokeWidth={2.5} />
                            Entrada
                          </>
                        ) : (
                          <>
                            <ArrowDown size={16} strokeWidth={2.5} />
                            Saída
                          </>
                        )}
                      </span>
                    </td>
                    <td
                      className={cn(
                        "px-6 py-4 font-medium",
                        t.type === "income"
                          ? "text-green-600"
                          : "text-gray-900",
                      )}
                    >
                      {formatCurrency(t.amount, t.type)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(t)}
                          className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                          aria-label="Editar"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm("Excluir esta transação?")) {
                              deleteTransaction.mutate(t.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600"
                          aria-label="Excluir"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {filtered.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
              <p className="text-sm text-gray-600">
                {PAGE_SIZE * (page - 1) + 1} a{" "}
                {Math.min(PAGE_SIZE * page, filtered.length)} |{" "}
                {filtered.length} resultado(s)
              </p>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
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
                      variant={n === page ? "primary" : "ghost"}
                      size="sm"
                      onClick={() => setPage(n)}
                    >
                      {n}
                    </Button>
                  ),
                )}
                <Button
                  variant="ghost"
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

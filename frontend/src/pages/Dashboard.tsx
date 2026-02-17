import { Link } from "react-router-dom";
import {
  Wallet,
  CircleArrowUp,
  CircleArrowDown,
  Plus,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { TransactionFormDialog } from "@/components/TransactionFormDialog";
import { useTransactions } from "@/hooks/useTransactions";
import { useCategories } from "@/hooks/useCategories";
import { CategoryIcon } from "@/components/CategoryIcon";
import { CategoryTag } from "@/components/CategoryTag";
import { cn } from "@/lib/cn";
import { useState, useMemo } from "react";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
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

export default function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const { data: transactions = [], isLoading } = useTransactions();
  const { data: categories = [] } = useCategories();

  const { total, income, expense } = useMemo(() => {
    let incomeSum = 0;
    let expenseSum = 0;
    for (const t of transactions) {
      if (t.type === "income") incomeSum += t.amount;
      else expenseSum += t.amount;
    }
    return {
      total: incomeSum - expenseSum,
      income: incomeSum,
      expense: expenseSum,
    };
  }, [transactions]);

  const recentTransactions = useMemo(
    () =>
      [...transactions]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5),
    [transactions],
  );

  const categoryTotals = useMemo(() => {
    const map: Record<string, { count: number; total: number }> = {};
    for (const c of categories) {
      map[c.id] = { count: 0, total: 0 };
    }
    for (const t of transactions) {
      if (t.categoryId && map[t.categoryId]) {
        map[t.categoryId].count += 1;
        if (t.type === "expense") map[t.categoryId].total += t.amount;
      }
    }
    return categories
      .map((c) => ({
        ...c,
        count: map[c.id]?.count ?? 0,
        total: map[c.id]?.total ?? 0,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [categories, transactions]);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center text-purple-base shrink-0">
                <Wallet size={20} />
              </div>
              <p className="text-xs font-medium uppercase text-gray-500 tracking-wider">
                Saldo total
              </p>
            </div>
            <p className="text-[28px] font-bold text-gray-800">
              R${" "}
              {total.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center text-brand-base shrink-0">
                <CircleArrowUp size={20} />
              </div>
              <p className="text-xs font-medium uppercase text-gray-500 tracking-wider">
                Receitas do mês
              </p>
            </div>
            <p className="text-[28px] font-bold text-gray-800">
              R${" "}
              {income.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center text-red-base shrink-0">
                <CircleArrowDown size={20} />
              </div>
              <p className="text-xs font-medium uppercase text-gray-500 tracking-wider">
                Despesas do mês
              </p>
            </div>
            <p className="text-[28px] font-bold text-gray-800">
              R${" "}
              {expense.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardContent className="p-0">
            <div className="flex items-center justify-between pl-6 pr-3 py-5 border-b border-gray-200">
              <h2 className="text-sm font-semibold uppercase text-gray-400 tracking-wide">
                Transações recentes
              </h2>
              <Link
                to="/transacoes"
                className="text-sm font-medium text-brand-base flex items-center gap-1"
              >
                Ver todas
                <ChevronRight size={20} />
              </Link>
            </div>
            <div className="divide-y divide-gray-200">
              {isLoading ? (
                <div className="p-6 text-center text-gray-500">
                  Carregando...
                </div>
              ) : recentTransactions.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  Nenhuma transação ainda.
                </div>
              ) : (
                recentTransactions.map((t) => (
                  <div
                    key={t.id}
                    className="grid grid-cols-[auto_1fr_7rem_10rem] items-center gap-3 px-6 py-4 hover:bg-gray-100"
                  >
                    <CategoryIcon
                      icon={t.category!.icon}
                      color={t.category!.color}
                    />
                    <div className="min-w-0">
                      <p className="text-base font-medium text-gray-800 truncate">
                        {t.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(t.date)}
                      </p>
                    </div>
                    <div className="flex justify-center">
                      <CategoryTag color={t.category?.color ?? null}>
                        {t.category?.name ?? "-"}
                      </CategoryTag>
                    </div>
                    <span className="inline-flex items-center justify-end gap-3 px-2">
                      <span className="font-semibold text-gray-800 text-sm">
                        {formatCurrency(t.amount, t.type)}
                      </span>
                      <span
                        className={cn(
                          "flex items-center justify-center shrink-0",
                          t.type === "income"
                            ? "text-green-base"
                            : "text-red-base",
                        )}
                      >
                        {t.type === "income" ? (
                          <CircleArrowUp size={16} strokeWidth={2.5} />
                        ) : (
                          <CircleArrowDown size={16} strokeWidth={2.5} />
                        )}
                      </span>
                    </span>
                  </div>
                ))
              )}
            </div>
            <div className="py-5 border-t border-gray-200 flex justify-center">
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-1 text-brand-base font-medium text-sm"
              >
                <Plus size={18} />
                Nova transação
              </button>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardContent className="p-0">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-sm font-semibold uppercase text-gray-400 tracking-wide">
                Categorias
              </h2>
              <Link
                to="/categorias"
                className="text-sm font-medium text-brand-base hover:underline flex items-center gap-0.5"
              >
                Gerenciar &gt;
              </Link>
            </div>
            <div className="divide-y divide-gray-200">
              {categories.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  Nenhuma categoria ainda.
                </div>
              ) : (
                categoryTotals.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between px-6 py-4"
                  >
                    <CategoryTag color={c.color ?? null}>{c.name}</CategoryTag>
                    <span className="text-sm text-gray-500">
                      {c.count} {c.count === 1 ? "item" : "itens"}
                    </span>
                    <span className="font-medium text-gray-800">
                      R${" "}
                      {c.total.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <TransactionFormDialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        edit={null}
      />
    </div>
  );
}

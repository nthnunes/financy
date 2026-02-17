import { Link } from "react-router-dom";
import {
  Wallet,
  CircleArrowUp,
  CircleArrowDown,
  ArrowUp,
  ArrowDown,
  Plus,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { TransactionFormDialog } from "@/components/TransactionFormDialog";
import { useTransactions } from "@/hooks/useTransactions";
import { useCategories } from "@/hooks/useCategories";
import {
  getCategoryIcon,
  getCategoryIconBgClass,
  getCategoryColorClasses,
  getCategoryIconColorClass,
} from "@/lib/categoryOptions";
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
              <div className="flex items-center justify-center text-green-base shrink-0">
                <CircleArrowUp size={20} strokeWidth={2.5} />
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
                <CircleArrowDown size={20} strokeWidth={2.5} />
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
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-sm font-semibold uppercase text-gray-400 tracking-wide">
                Transações recentes
              </h2>
              <Link
                to="/transacoes"
                className="text-sm font-medium text-brand-base hover:underline flex items-center gap-0.5"
              >
                Ver todas &gt;
              </Link>
            </div>
            <div className="divide-y divide-gray-100">
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
                    className="flex items-center justify-between px-6 py-4 hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                          getCategoryIconBgClass(t.category?.color ?? null),
                        )}
                      >
                        {getCategoryIcon(
                          t.category?.icon ?? null,
                          20,
                          getCategoryIconColorClass(t.category?.color ?? null),
                        ) ?? <TrendingUp size={20} className="text-gray-500" />}
                      </span>
                      <div>
                        <p className="text-base font-medium text-gray-800">
                          {t.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(t.date)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium",
                          getCategoryColorClasses(t.category?.color ?? null),
                        )}
                      >
                        {t.category?.name ?? "-"}
                      </span>
                      <span
                        className={cn(
                          "font-medium",
                          t.type === "income"
                            ? "text-green-base"
                            : "text-gray-800",
                        )}
                      >
                        {formatCurrency(t.amount, t.type)}
                      </span>
                      <span
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center",
                          t.type === "income"
                            ? "bg-green-light text-green-base"
                            : "bg-red-light text-red-base",
                        )}
                      >
                        {t.type === "income" ? (
                          <ArrowUp size={16} strokeWidth={2.5} />
                        ) : (
                          <ArrowDown size={16} strokeWidth={2.5} />
                        )}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-center">
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-1.5 text-brand-base font-medium text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-brand-base/20 rounded"
              >
                <Plus size={18} strokeWidth={2.5} />
                Nova transação
              </button>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardContent className="p-0">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
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
            <div className="divide-y divide-gray-100">
              {categories.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  Nenhuma categoria ainda.
                </div>
              ) : (
                categoryTotals.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between px-6 py-4 hover:bg-gray-100"
                  >
                    <span
                      className={cn(
                        "inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium",
                        getCategoryColorClasses(c.color ?? null),
                      )}
                    >
                      {c.name}
                    </span>
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

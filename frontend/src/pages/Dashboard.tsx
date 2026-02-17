import { Link } from "react-router-dom";
import {
  Wallet,
  ArrowUp,
  ArrowDown,
  Plus,
  Utensils,
  Car,
  ShoppingCart,
  TrendingUp,
  Ticket,
  Home,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { TransactionFormDialog } from "@/components/TransactionFormDialog";
import { useTransactions } from "@/hooks/useTransactions";
import { useCategories } from "@/hooks/useCategories";
import { cn } from "@/lib/cn";
import { useState, useMemo } from "react";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Alimentação: <Utensils size={20} className="text-blue-500" />,
  Transporte: <Car size={20} className="text-purple-500" />,
  Mercado: <ShoppingCart size={20} className="text-orange-500" />,
  Investimento: <TrendingUp size={20} className="text-green-500" />,
  Utilidades: <Home size={20} className="text-yellow-600" />,
  Salário: <TrendingUp size={20} className="text-green-600" />,
  Entretenimento: <Ticket size={20} className="text-pink-500" />,
};

const CATEGORY_COLORS: Record<string, string> = {
  Alimentação: "bg-blue-100 text-blue-800",
  Transporte: "bg-purple-100 text-purple-800",
  Mercado: "bg-orange-100 text-orange-800",
  Investimento: "bg-green-100 text-green-800",
  Utilidades: "bg-yellow-100 text-yellow-800",
  Salário: "bg-green-100 text-green-800",
  Entretenimento: "bg-pink-100 text-pink-800",
};

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
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Dashboard</h1>
      <p className="text-gray-500 mb-6">Visão geral das suas finanças</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
              <Wallet size={24} />
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-gray-500 tracking-wider">
                Saldo total
              </p>
              <p className="text-[28px] font-bold text-gray-900">
                R${" "}
                {total.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
              <ArrowUp size={24} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-gray-500 tracking-wider">
                Receitas do mês
              </p>
              <p className="text-[28px] font-bold text-gray-900">
                R${" "}
                {income.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
              <ArrowDown size={24} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-gray-500 tracking-wider">
                Despesas do mês
              </p>
              <p className="text-[28px] font-bold text-gray-900">
                R${" "}
                {expense.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
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
                className="text-sm font-medium text-primary hover:underline flex items-center gap-0.5"
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
                    className="flex items-center justify-between px-6 py-4 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400">
                        {t.category?.name ? (
                          (CATEGORY_ICONS[t.category.name] ?? (
                            <TrendingUp size={20} className="text-gray-400" />
                          ))
                        ) : (
                          <TrendingUp size={20} className="text-gray-400" />
                        )}
                      </span>
                      <div>
                        <p className="text-base font-medium text-gray-900">
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
                          t.category?.name
                            ? (CATEGORY_COLORS[t.category.name] ??
                                "bg-gray-100 text-gray-800")
                            : "bg-gray-100 text-gray-500",
                        )}
                      >
                        {t.category?.name ?? "-"}
                      </span>
                      <span
                        className={cn(
                          "font-medium",
                          t.type === "income"
                            ? "text-green-600"
                            : "text-gray-900",
                        )}
                      >
                        {formatCurrency(t.amount, t.type)}
                      </span>
                      <span
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center",
                          t.type === "income"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600",
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
                className="inline-flex items-center gap-1.5 text-primary font-medium text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-primary/20 rounded"
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
                className="text-sm font-medium text-primary hover:underline flex items-center gap-0.5"
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
                    className="flex items-center justify-between px-6 py-4 hover:bg-gray-50"
                  >
                    <span
                      className={cn(
                        "inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium",
                        CATEGORY_COLORS[c.name] ?? "bg-gray-100 text-gray-800",
                      )}
                    >
                      {c.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {c.count} {c.count === 1 ? "item" : "itens"}
                    </span>
                    <span className="font-medium text-gray-900">
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

import { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Tag,
  Utensils,
  ShoppingCart,
  Briefcase,
  Heart,
  Car,
  Home,
  Ticket,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CategoryFormDialog } from "@/components/CategoryFormDialog";
import { useCategories, type Category } from "@/hooks/useCategories";
import { useDeleteCategory } from "@/hooks/useCategories";
import { useTransactions } from "@/hooks/useTransactions";
import { cn } from "@/lib/cn";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Alimentação: <Utensils size={24} className="text-blue-500" />,
  Mercado: <ShoppingCart size={24} className="text-orange-500" />,
  Salário: <Briefcase size={24} className="text-green-500" />,
  Saúde: <Heart size={24} className="text-pink-500" />,
  Transporte: <Car size={24} className="text-purple-500" />,
  Utilidades: <Home size={24} className="text-yellow-600" />,
  Entretenimento: <Ticket size={24} className="text-pink-500" />,
  Investimento: <TrendingUp size={24} className="text-green-500" />,
};

const CATEGORY_COLORS: Record<string, string> = {
  Alimentação: "bg-blue-100 text-blue-800",
  Mercado: "bg-orange-100 text-orange-800",
  Salário: "bg-green-100 text-green-800",
  Saúde: "bg-pink-100 text-pink-800",
  Transporte: "bg-purple-100 text-purple-800",
  Utilidades: "bg-yellow-100 text-yellow-800",
  Entretenimento: "bg-pink-100 text-pink-800",
  Investimento: "bg-green-100 text-green-800",
};

function getCategoryStats(
  transactions: { categoryId: string | null }[],
  categoryId: string,
) {
  const count = transactions.filter((t) => t.categoryId === categoryId).length;
  return count;
}

export default function Categories() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const { data: categories = [], isLoading } = useCategories();
  const { data: transactions = [] } = useTransactions();
  const deleteCategory = useDeleteCategory();

  const totalTransactions = transactions.length;
  const mostUsed =
    categories.length > 0
      ? categories.reduce((a, b) =>
          getCategoryStats(transactions, a.id) >=
          getCategoryStats(transactions, b.id)
            ? a
            : b,
        )
      : null;

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const openEdit = (c: Category) => {
    setEditing(c);
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
          <h1 className="text-2xl font-bold text-gray-900">Categorias</h1>
          <p className="text-gray-500 mt-1">
            Organize suas transações por categorias
          </p>
        </div>
        <Button variant="primary" size="md" onClick={openCreate}>
          <Plus size={20} strokeWidth={2.5} className="mr-1.5" />
          Nova categoria
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600">
              <Tag size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {categories.length}
              </p>
              <p className="text-xs font-medium uppercase text-gray-500 tracking-wider">
                Total de categorias
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {totalTransactions}
              </p>
              <p className="text-xs font-medium uppercase text-gray-500 tracking-wider">
                Total de transações
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600">
              <Utensils size={24} />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">
                {mostUsed?.name ?? "-"}
              </p>
              <p className="text-xs font-medium uppercase text-gray-500 tracking-wider">
                Categoria mais utilizada
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Carregando...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((c) => {
            const count = getCategoryStats(transactions, c.id);
            const isMostUsed = mostUsed?.id === c.id;
            return (
              <Card key={c.id} className="relative">
                {isMostUsed && (
                  <span className="absolute top-3 right-3 text-xs font-medium text-primary bg-green-50 px-2 py-0.5 rounded">
                    Mais utilizada
                  </span>
                )}
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600">
                      {CATEGORY_ICONS[c.name] ?? <Tag size={24} />}
                    </div>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => openEdit(c)}
                        className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                        aria-label="Editar"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm("Excluir esta categoria?")) {
                            deleteCategory.mutate(c.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600"
                        aria-label="Excluir"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-900">{c.name}</h3>
                  <span
                    className={cn(
                      "inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium",
                      CATEGORY_COLORS[c.name] ?? "bg-gray-100 text-gray-800",
                    )}
                  >
                    {c.name}
                  </span>
                  <p className="mt-2 text-sm text-gray-500">
                    {count} {count === 1 ? "item" : "itens"}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <CategoryFormDialog
        open={modalOpen}
        onClose={closeModal}
        edit={editing}
      />
    </div>
  );
}

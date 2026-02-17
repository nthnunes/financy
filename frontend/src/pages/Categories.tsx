import { useState } from "react";
import { Plus, Pencil, Trash2, Tag, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CategoryFormDialog } from "@/components/CategoryFormDialog";
import { useCategories, type Category } from "@/hooks/useCategories";
import { useDeleteCategory } from "@/hooks/useCategories";
import { useTransactions } from "@/hooks/useTransactions";
import {
  getCategoryIcon,
  getCategoryIconBgClass,
  getCategoryColorClasses,
} from "@/lib/categoryOptions";
import { cn } from "@/lib/cn";

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
          <Plus size={20} strokeWidth={2.5} />
          Nova categoria
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
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
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Carregando...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((c) => {
            const count = getCategoryStats(transactions, c.id);
            return (
              <Card key={c.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center text-white",
                        getCategoryIconBgClass(c.color ?? null),
                      )}
                    >
                      {getCategoryIcon(c.icon ?? null, 24, "text-white") ?? (
                        <Tag size={24} className="text-white" />
                      )}
                    </div>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm("Excluir esta categoria?")) {
                            deleteCategory.mutate(c.id);
                          }
                        }}
                        className="p-2 rounded-full border border-gray-200 text-red-500 hover:bg-red-50 hover:border-red-100 transition-colors"
                        aria-label="Excluir"
                      >
                        <Trash2 size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => openEdit(c)}
                        className="p-2 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                        aria-label="Editar"
                      >
                        <Pencil size={18} />
                      </button>
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">{c.name}</h3>
                  {c.description && (
                    <p className="mt-1 text-sm text-gray-500">
                      {c.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-4 gap-2">
                    <span
                      className={cn(
                        "inline-flex px-2.5 py-1 rounded-full text-xs font-medium",
                        getCategoryColorClasses(c.color ?? null),
                      )}
                    >
                      {c.name}
                    </span>
                    <span className="text-sm text-gray-500 shrink-0">
                      {count} {count === 1 ? "item" : "itens"}
                    </span>
                  </div>
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

import { useState } from "react";
import { Plus, Pencil, Trash, Tag, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { CategoryFormDialog } from "@/components/CategoryFormDialog";
import { useCategories, type Category } from "@/hooks/useCategories";
import { useDeleteCategory } from "@/hooks/useCategories";
import { useTransactions } from "@/hooks/useTransactions";
import { CategoryIcon } from "@/components/CategoryIcon";
import { CategoryTag } from "@/components/CategoryTag";

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
          <h1 className="text-2xl font-bold text-gray-800">Categorias</h1>
          <p className="text-gray-500 mt-1">
            Organize suas transações por categorias
          </p>
        </div>
        <Button icon={Plus} variant="primary" size="sm" onClick={openCreate}>
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
              <p className="text-2xl font-bold text-gray-800">
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
              <p className="text-2xl font-bold text-gray-800">
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
                    <CategoryIcon icon={c.icon} color={c.color} />
                    <div className="flex gap-2">
                      <IconButton
                        icon={Trash}
                        variant="danger"
                        onClick={() => {
                          if (window.confirm("Excluir esta categoria?")) {
                            deleteCategory.mutate(c.id);
                          }
                        }}
                        aria-label="Excluir"
                      />
                      <IconButton
                        icon={Pencil}
                        variant="default"
                        onClick={() => openEdit(c)}
                        aria-label="Editar"
                      />
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg">{c.name}</h3>
                  {c.description && (
                    <p className="mt-1 text-sm text-gray-500">
                      {c.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-4 gap-2">
                    <CategoryTag color={c.color ?? null}>{c.name}</CategoryTag>
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

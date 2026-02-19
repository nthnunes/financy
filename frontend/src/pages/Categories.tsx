import { useState } from "react";
import { Plus, Pencil, Trash, Tag, ArrowUpDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { CategoryFormDialog } from "@/components/CategoryFormDialog";
import { useCategories, type Category } from "@/hooks/useCategories";
import { useDeleteCategory } from "@/hooks/useCategories";
import { useTransactions } from "@/hooks/useTransactions";
import {
  getCategoryIcon,
  getCategoryIconColorClass,
} from "@/lib/categoryOptions";
import { CategoryIcon } from "@/components/CategoryIcon";
import { CategoryTag } from "@/components/CategoryTag";

function getCategoryStats(
  transactions: { categoryId: string | null }[],
  categoryId: string,
) {
  const count = transactions.filter((t) => t.categoryId === categoryId).length;
  return count;
}

function getMostUsedCategory(
  transactions: { categoryId: string | null }[],
  categories: Category[],
): Category | null {
  const withCategory = transactions.filter((t) => t.categoryId != null);
  if (withCategory.length === 0) return null;
  const counts = new Map<string, number>();
  for (const t of withCategory) {
    if (t.categoryId) {
      counts.set(t.categoryId, (counts.get(t.categoryId) ?? 0) + 1);
    }
  }
  let maxId: string | null = null;
  let maxCount = 0;
  counts.forEach((count, id) => {
    if (count > maxCount) {
      maxCount = count;
      maxId = id;
    }
  });
  if (!maxId) return null;
  return categories.find((c) => c.id === maxId) ?? null;
}

export default function Categories() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const { data: categories = [], isLoading } = useCategories();
  const { data: transactions = [] } = useTransactions();
  const deleteCategory = useDeleteCategory();

  const totalTransactions = transactions.length;
  const mostUsedCategory = getMostUsedCategory(transactions, categories);

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
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Categorias</h1>
          <p className="text-gray-500 mt-0.5">
            Organize suas transações por categorias
          </p>
        </div>
        <Button icon={Plus} variant="primary" size="sm" onClick={openCreate}>
          Nova categoria
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex flex-col gap-2 p-6">
            <div className="flex items-center gap-4">
              <div className="w-6 shrink-0 flex items-center justify-center text-gray-700">
                <Tag size={24} />
              </div>
              <p className="text-[28px] font-bold text-gray-800">
                {categories.length}
              </p>
            </div>
            <div className="flex gap-4">
              <div className="w-6 shrink-0" aria-hidden />
              <p className="text-xs font-medium uppercase text-gray-500 tracking-wider">
                Total de categorias
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col gap-2 p-6">
            <div className="flex items-center gap-4">
              <div className="w-6 shrink-0 flex items-center justify-center text-purple-base">
                <ArrowUpDown size={24} />
              </div>
              <p className="text-[28px] font-bold text-gray-800">
                {totalTransactions}
              </p>
            </div>
            <div className="flex gap-4">
              <div className="w-6 shrink-0" aria-hidden />
              <p className="text-xs font-medium uppercase text-gray-500 tracking-wider">
                Total de transações
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col gap-2 p-6">
            {mostUsedCategory ? (
              <>
                <div className="flex items-center gap-4">
                  <div className="w-6 shrink-0 flex items-center justify-center">
                    {getCategoryIcon(
                      mostUsedCategory.icon,
                      24,
                      getCategoryIconColorClass(mostUsedCategory.color ?? null),
                    )}
                  </div>
                  <p className="text-[28px] font-bold text-gray-800 truncate min-w-0">
                    {mostUsedCategory.name}
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="w-6 shrink-0" aria-hidden />
                  <p className="text-xs font-medium uppercase text-gray-500 tracking-wider">
                    Categoria mais utilizada
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-4">
                  <div className="w-6 shrink-0 flex items-center justify-center text-gray-400">
                    —
                  </div>
                  <p className="text-[28px] font-bold text-gray-800">—</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-6 shrink-0" aria-hidden />
                  <p className="text-xs font-medium uppercase text-gray-500 tracking-wider">
                    Categoria mais utilizada
                  </p>
                </div>
              </>
            )}
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
              <Card key={c.id} className="h-full">
                <CardContent className="p-6 flex flex-col h-full gap-5">
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
                  <div className="flex flex-col gap-1">
                    <h3 className="font-bold text-gray-800 text-lg">
                      {c.name}
                    </h3>
                    {c.description && (
                      <p className="text-sm text-gray-500">{c.description}</p>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-auto">
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

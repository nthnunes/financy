import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getGraphQLClient } from "@/lib/graphql";
import {
  GET_CATEGORIES,
  CREATE_CATEGORY,
  UPDATE_CATEGORY,
  DELETE_CATEGORY,
} from "@/graphql/categories";

export interface Category {
  id: string;
  name: string;
  description: string | null;
  icon: string;
  color: string;
  userId: string;
}

export function useCategories() {
  const client = getGraphQLClient();
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const data = await client.request<{ categories: Category[] }>(
        GET_CATEGORIES,
      );
      return data.categories;
    },
  });
}

export function useCreateCategory() {
  const client = getGraphQLClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      name: string;
      description?: string | null;
      icon: string;
      color: string;
    }) => {
      const data = await client.request<{ createCategory: Category }>(
        CREATE_CATEGORY,
        { input },
      );
      return data.createCategory;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useUpdateCategory() {
  const client = getGraphQLClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string;
      input: {
        name?: string;
        description?: string | null;
        icon: string;
        color: string;
      };
    }) => {
      const data = await client.request<{ updateCategory: Category }>(
        UPDATE_CATEGORY,
        { id, input },
      );
      return data.updateCategory;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}

export function useDeleteCategory() {
  const client = getGraphQLClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const data = await client.request<{ deleteCategory: boolean }>(
        DELETE_CATEGORY,
        { id },
      );
      return data.deleteCategory;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}

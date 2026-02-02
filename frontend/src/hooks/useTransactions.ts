import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getGraphQLClient } from "@/lib/graphql";
import {
  GET_TRANSACTIONS,
  CREATE_TRANSACTION,
  UPDATE_TRANSACTION,
  DELETE_TRANSACTION,
} from "@/graphql/transactions";

export interface Category {
  id: string;
  name: string;
  userId: string;
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: string;
  date: string;
  categoryId: string | null;
  userId: string;
  category: Category | null;
}

export function useTransactions() {
  const client = getGraphQLClient();
  return useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const data = await client.request<{ transactions: Transaction[] }>(
        GET_TRANSACTIONS,
      );
      return data.transactions;
    },
  });
}

export function useCreateTransaction() {
  const client = getGraphQLClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      title: string;
      amount: number;
      type: string;
      date: string;
      categoryId?: string | null;
    }) => {
      const data = await client.request<{ createTransaction: Transaction }>(
        CREATE_TRANSACTION,
        {
          input,
        },
      );
      return data.createTransaction;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["transactions"] }),
  });
}

export function useUpdateTransaction() {
  const client = getGraphQLClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string;
      input: {
        title?: string;
        amount?: number;
        type?: string;
        date?: string;
        categoryId?: string | null;
      };
    }) => {
      const data = await client.request<{ updateTransaction: Transaction }>(
        UPDATE_TRANSACTION,
        {
          id,
          input,
        },
      );
      return data.updateTransaction;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["transactions"] }),
  });
}

export function useDeleteTransaction() {
  const client = getGraphQLClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const data = await client.request<{ deleteTransaction: boolean }>(
        DELETE_TRANSACTION,
        { id },
      );
      return data.deleteTransaction;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["transactions"] }),
  });
}

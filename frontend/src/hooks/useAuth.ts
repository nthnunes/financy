import { useMutation } from "@tanstack/react-query";
import { useAuth as useAuthContext } from "@/contexts/AuthContext";
import { getGraphQLClient } from "@/lib/graphql";
import {
  LOGIN_MUTATION,
  REGISTER_MUTATION,
  UPDATE_USER_MUTATION,
} from "@/graphql/auth";

export function useLogin() {
  const { setAuth } = useAuthContext();
  const client = getGraphQLClient();

  return useMutation({
    mutationFn: async (input: { email: string; password: string }) => {
      const data = await client.request<{
        login: {
          token: string;
          user: { id: string; name: string; email: string; createdAt: string };
        };
      }>(LOGIN_MUTATION, { input });
      return data.login;
    },
    onSuccess: (data) => {
      setAuth(data.token, data.user);
    },
  });
}

export function useRegister() {
  const { setAuth } = useAuthContext();
  const client = getGraphQLClient();

  return useMutation({
    mutationFn: async (input: {
      name: string;
      email: string;
      password: string;
    }) => {
      const data = await client.request<{
        register: {
          token: string;
          user: { id: string; name: string; email: string; createdAt: string };
        };
      }>(REGISTER_MUTATION, { input });
      return data.register;
    },
    onSuccess: (data) => {
      setAuth(data.token, data.user);
    },
  });
}

export function useUpdateUser() {
  const { token, setAuth } = useAuthContext();
  const client = getGraphQLClient();

  return useMutation({
    mutationFn: async (input: { name: string }) => {
      const data = await client.request<{
        updateUser: {
          id: string;
          name: string;
          email: string;
          createdAt: string;
        };
      }>(UPDATE_USER_MUTATION, { input });
      return data.updateUser;
    },
    onSuccess: (updatedUser) => {
      if (token) setAuth(token, updatedUser);
    },
  });
}

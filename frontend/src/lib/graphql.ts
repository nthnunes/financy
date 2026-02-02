import { GraphQLClient } from "graphql-request";

const endpoint = import.meta.env.VITE_BACKEND_URL
  ? `${import.meta.env.VITE_BACKEND_URL}/graphql`
  : "http://localhost:3001/graphql";

export function createGraphQLClient(token: string | null) {
  return new GraphQLClient(endpoint, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

let defaultClient = createGraphQLClient(null);

export function getGraphQLClient(token?: string | null) {
  if (token !== undefined) {
    defaultClient = createGraphQLClient(token);
  }
  return defaultClient;
}

export function setGraphQLToken(token: string | null) {
  defaultClient = createGraphQLClient(token);
}

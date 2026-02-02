import { gql } from "graphql-request";

export const GET_TRANSACTIONS = gql`
  query Transactions {
    transactions {
      id
      title
      amount
      type
      date
      categoryId
      userId
      category {
        id
        name
        userId
      }
    }
  }
`;

export const CREATE_TRANSACTION = gql`
  mutation CreateTransaction($input: CreateTransactionInput!) {
    createTransaction(input: $input) {
      id
      title
      amount
      type
      date
      categoryId
      userId
      category {
        id
        name
        userId
      }
    }
  }
`;

export const UPDATE_TRANSACTION = gql`
  mutation UpdateTransaction($id: ID!, $input: UpdateTransactionInput!) {
    updateTransaction(id: $id, input: $input) {
      id
      title
      amount
      type
      date
      categoryId
      userId
      category {
        id
        name
        userId
      }
    }
  }
`;

export const DELETE_TRANSACTION = gql`
  mutation DeleteTransaction($id: ID!) {
    deleteTransaction(id: $id)
  }
`;

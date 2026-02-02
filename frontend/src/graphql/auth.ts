import { gql } from "graphql-request";

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        name
        email
        createdAt
      }
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      user {
        id
        name
        email
        createdAt
      }
    }
  }
`;

export const GET_ME = gql`
  query Me {
    me {
      id
      name
      email
      createdAt
    }
  }
`;

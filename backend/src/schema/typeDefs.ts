export const typeDefs = `#graphql
  type User {
    id: ID!
    name: String!
    email: String!
    createdAt: String!
  }

  type Token {
    token: String!
    user: User!
  }

  type Category {
    id: ID!
    name: String!
    userId: String!
  }

  type Transaction {
    id: ID!
    title: String!
    amount: Float!
    type: String!
    date: String!
    categoryId: String
    userId: String!
    category: Category
  }

  input RegisterInput {
    name: String!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input CreateCategoryInput {
    name: String!
  }

  input UpdateCategoryInput {
    name: String!
  }

  input CreateTransactionInput {
    title: String!
    amount: Float!
    type: String!
    date: String!
    categoryId: String
  }

  input UpdateTransactionInput {
    title: String
    amount: Float
    type: String
    date: String
    categoryId: String
  }

  type Query {
    me: User
    categories: [Category!]!
    transactions: [Transaction!]!
  }

  type Mutation {
    register(input: RegisterInput!): Token!
    login(input: LoginInput!): Token!
    createCategory(input: CreateCategoryInput!): Category!
    updateCategory(id: ID!, input: UpdateCategoryInput!): Category!
    deleteCategory(id: ID!): Boolean!
    createTransaction(input: CreateTransactionInput!): Transaction!
    updateTransaction(id: ID!, input: UpdateTransactionInput!): Transaction!
    deleteTransaction(id: ID!): Boolean!
  }
`;

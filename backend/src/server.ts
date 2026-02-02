import "dotenv/config";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema/typeDefs";
import { resolvers } from "./schema/resolvers";
import { createContext } from "./context";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

async function main() {
  const { url } = await startStandaloneServer(server, {
    context: async ({ req }) => createContext({ req }),
    listen: { port: Number(process.env.PORT) || 3001 },
  });
  console.log(`Server ready at ${url}`);
}

main();

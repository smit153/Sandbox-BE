import dotenv from "dotenv";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import connectDB from "./db/connectDB";
import {typeDefs}  from "./schemas/typedef";
import { resolvers } from "./resolvers/resolver";

dotenv.config();
(async () => {
  try {
    const PORT = process.env.PORT || "5000";
    const server = new ApolloServer({
      typeDefs,
      resolvers,
    });

    const { url } = await startStandaloneServer(server, {
      listen: { port: parseInt(PORT) },
    });

    if (process.env.MONGO_URI) {
      await connectDB(process.env.MONGO_URI);
    } else {
      throw new Error("MONGO_URI not found in .env file");
    }

    console.log(`Server ready at: ${url}`);
  } catch (error) {
    console.log(error);
  }
})();

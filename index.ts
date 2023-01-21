import bodyParser from "body-parser";
import cors from "cors";
import * as fs from "fs";
import express from "express";
import { expressjwt } from "express-jwt";
import { Jwt } from "jsonwebtoken";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import resolvers from "./resolvers";
import * as mongoose from "mongoose";

const port = 9000;

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://admin:admin@localhost:27017/graphql-course");

const jwtSecret = Buffer.from("Zn8Q5tyZ/G1MHltc4F/gTkVJMlrbKiZt", "base64");

const typeDefs = fs.readFileSync("./schema.graphql", { encoding: "utf-8" });

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const schema = makeExecutableSchema({ typeDefs, resolvers });

async function startServer() {
  await server.start();
  const app = express();
  app.use(
    cors(),
    bodyParser.json(),
    expressjwt({
      algorithms: ["none"],
      credentialsRequired: false,
      secret: jwtSecret,
    })
  );
  app.use("/graphql", expressMiddleware(server));
  app.listen(port, () => console.log(`Server running on port ${port}`));
}

startServer();

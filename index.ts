import cors from "cors";
import { readFile } from "fs/promises";
import express from "express";
import { expressjwt } from "express-jwt";
import jwt from "jsonwebtoken";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import resolvers from "./resolvers";
import * as mongoose from "mongoose";
import Users from "./models/users";
import DataLoader from "dataloader";
import Companies from "./models/companies";

const getCompaniesByIds = async (ids: readonly string[]) => {
  return ids.map((item) => Companies.findById(item).exec().then(console.log));
};

const PORT = 9000;
const JWT_SECRET = Buffer.from("Zn8Q5tyZ/G1MHltc4F/gTkVJMlrbKiZt", "base64");

async function startServer() {
  mongoose.set("strictQuery", false);
  mongoose
    .connect("mongodb://admin:admin@localhost:27017/graphqlByExample")
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));

  const app = express();

  const typeDefs = await readFile("./schema.graphql", "utf-8");

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  await server.start();

  app.use(
    cors(),
    express.json(),
    expressjwt({
      algorithms: ["HS256"],
      credentialsRequired: false,
      secret: JWT_SECRET,
    })
  );
  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req }: { req: any }) => ({
        user: req.auth && (await Users.findById(req.auth.sub)),
        companyLoader: new DataLoader(getCompaniesByIds),
      }),
    })
  );
  app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await Users.findOne({ email }).exec();
    if (!user || user.password !== password) {
      res.sendStatus(401);
      return;
    }
    const token = jwt.sign({ sub: user.id }, JWT_SECRET);
    res.send({ token });
  });

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

startServer();

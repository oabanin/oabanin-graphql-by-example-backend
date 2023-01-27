import bodyParser from "body-parser";
import cors from "cors";
import * as fs from "fs";
import express from "express";
import { expressjwt } from "express-jwt";
import jwt from "jsonwebtoken";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import resolvers from "./resolvers";
import * as mongoose from "mongoose";
import Users from "./models/users";

const port = 9000;

const jwtSecret = Buffer.from("Zn8Q5tyZ/G1MHltc4F/gTkVJMlrbKiZt", "base64");
const typeDefs = fs.readFileSync("./schema.graphql", { encoding: "utf-8" });

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

async function startServer() {
  mongoose.set("strictQuery", false);
  mongoose
    .connect("mongodb://admin:admin@localhost:27017/graphqlByExample")
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));

  const app = express();
  await server.start();
  app.use(
    cors(),
    bodyParser.json(),
    expressjwt({
      algorithms: ["HS256"],
      credentialsRequired: false,
      secret: jwtSecret,
    })
  );
  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req }: { req: any }) => ({ user: req.auth }),
    })
  );
  app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await Users.findOne({ email }).exec();
    if (!user || user.password !== password) {
      res.sendStatus(401);
      return;
    }
    const token = jwt.sign({ sub: user.id }, jwtSecret);
    res.send({ token });
  });

  app.listen(port, () => console.log(`Server running on port ${port}`));
}

startServer();

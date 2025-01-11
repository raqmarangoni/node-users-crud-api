import express from "express";
import { config } from "dotenv";
import { MongoGetUsersRepository } from "./repositories/get-users/mongo-get-users";
import { GetUsersController } from "./controllers/get-users/get-users";
import { MongoClient } from "./database/mongo";
import { MongoCreateUserRepository } from "./repositories/create-user/mongo-create-user";
import { CreateUserController } from "./controllers/create-user/create-user";
import { MongoUpdateUserRepository } from "./repositories/update-user/mongo-update-user";
import { UpdateUserController } from "./controllers/update-user/update-user";
import { MongoDeleteUserRepository } from "./repositories/delete-user/mongo-delete-user";
import { DeleteUserController } from "./controllers/delete-user/delete-user";
import Redis from "ioredis";

const redisClient = new Redis({
  host: "localhost",
  port: 6379,
});

redisClient.on("connect", () => console.log("Conectado ao Redis com ioredis!"));
redisClient.on("error", (err) =>
  console.error("Erro ao conectar ao Redis:", err)
);

const main = async () => {
  config();
  const app = express();
  app.use(express.json());
  await MongoClient.connect();

  app.post("/users", async (req, res) => {
    const mongoCreateUserRepository = new MongoCreateUserRepository();
    const createUserController = new CreateUserController(
      mongoCreateUserRepository
    );
    const { body, statusCode } = await createUserController.handle({
      body: req.body,
    });
    res.status(statusCode).json(body);
  });

  app.get("/users", async (req, res) => {
    const cacheKey = "users";
    try {
      const cachedUsers = await redisClient.get(cacheKey);
      if (cachedUsers) {
        const users = JSON.parse(cachedUsers);
        res.status(200).json(users);
        return
      }
      const mongoGetUsersRepository = new MongoGetUsersRepository();
      const getUsersController = new GetUsersController(
        mongoGetUsersRepository
      );
      const { body, statusCode } = await getUsersController.handle();
      console.log(body)
      if (statusCode === 200) {
        await redisClient.setex(cacheKey, 5, JSON.stringify(body));
      }
      res.status(statusCode).json(body);
    } catch (error) {
      console.log(error);
      res.status(500).json("Erro ao encontrar lista de usuários");
    }
  });

  app.patch("/users/:id", async (req, res) => {
    const mongoUpdateUserRepository = new MongoUpdateUserRepository();
    const updateUserController = new UpdateUserController(
      mongoUpdateUserRepository
    );
    const { body, statusCode } = await updateUserController.handle({
      body: req.body,
      params: req.params,
    });
    res.status(statusCode).json(body);
  });

  app.delete("/users/:id", async (req, res) => {
    const mongoDeleteUserRepository = new MongoDeleteUserRepository();
    const deleteUserController = new DeleteUserController(
      mongoDeleteUserRepository
    );
    const { body, statusCode } = await deleteUserController.handle({
      params: req.params,
    });
    res.status(statusCode).send(body);
  });

  const port = process.env.PORT || 8000;
  app.listen(port, () => console.log(`listening on port ${port}}`));
};
main();

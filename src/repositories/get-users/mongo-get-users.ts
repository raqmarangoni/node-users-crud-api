import { IGetUsersRepository } from "../../controllers/get-users/protocols";
import { User } from "../../models/users";

export class MongoGetUsersRepository implements IGetUsersRepository {
  async getUsers(): Promise<User[]> {
    return await Promise.resolve([
      {
        firstName: "Raquel",
        lastName: "Marangoni",
        email: "raquel@mail.com",
        password: "123",
      },
    ]);
  }
}

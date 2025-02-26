import { User } from "../../models/users";
import { HttpRequest, HttpResponse } from "../protocols";
import { IDeleteUserController, IDeleteUserRepository } from "./protocols";
export class DeleteUserController implements IDeleteUserController {
  constructor(private readonly deleteUserRepository: IDeleteUserRepository) {}
  async handle(httpRequest: HttpRequest<unknown>): Promise<HttpResponse<User>> {
    try {
      const id = httpRequest?.params?.id;
      if (!id) {
        return {
          statusCode: 400,
          body: "Missing user id",
        };
      }
      const user = await this.deleteUserRepository.deleteUser(id);
      return {
        statusCode: 200,
        body: user,
      };
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        body: "Something went wrong",
      };
    }
  }
}

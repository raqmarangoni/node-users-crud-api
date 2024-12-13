import { User } from "../../models/users";
import { HttpRequest, HttpResponse } from "../protocols";
import {
  IUpdateUserController,
  IUpdateUserRepository,
  UpdateUserParams,
} from "./protocols";

export class UpdateUserController implements IUpdateUserController {
  constructor(private readonly updateUserRepository: IUpdateUserRepository) {}

  async handle(httpRequest: HttpRequest<unknown>): Promise<HttpResponse<User>> {
    try {
      const id = httpRequest?.params?.id;
      const body = httpRequest?.body;
  
      if (!id) {
        return {
          statusCode: 400,
          body: "Missing user id",
        };
      }
  
      if (!body || typeof body !== "object" || Array.isArray(body)) {
        return {
          statusCode: 400,
          body: "Invalid body format",
        };
      }
  
      const allowedFieldsToUpdate: (keyof UpdateUserParams)[] = [
        "firstName",
        "lastName",
        "password",
      ];
  
      const someFieldIsNotAllowedToUpdate = Object.keys(body).some(
        (key) => !allowedFieldsToUpdate.includes(key as keyof UpdateUserParams)
      );
  
      if (someFieldIsNotAllowedToUpdate) {
        return {
          statusCode: 400,
          body: "Some received field is not allowed",
        };
      }
  
      const user = await this.updateUserRepository.updateUser(
        id,
        body as UpdateUserParams
      );
  
      return {
        statusCode: 200,
        body: user,
      };
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        body: "Something went wrong.",
      };
    }
  }  
}

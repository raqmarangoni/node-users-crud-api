import validator from "validator";
import { User } from "../../models/users";
import { HttpRequest, HttpResponse } from "../protocols";
import {
  CreateUserParams,
  IcreateUserController,
  ICreateUserRepository,
} from "./protocols";

export class CreateUserController implements IcreateUserController {
  constructor(private readonly createUserRepository: ICreateUserRepository) {}
  async handle(
    httpRequest: HttpRequest<CreateUserParams>
  ): Promise<HttpResponse<User>> {
    try {
      const requiredFields = ["firstName", "lastName", "email", "password"];
      for (const field of requiredFields) {
        if (!httpRequest?.body?.[field as keyof CreateUserParams]?.length) {
          return {
            statusCode: 400,
            body: `Field ${field} is required`,
          };
        }
      }
      const emailIsValid = validator.isEmail(httpRequest.body!.email);
      if (!emailIsValid) {
        return {
          statusCode: 400,
          body: "E-mail is inavalid",
        };
      }
      const user = await this.createUserRepository.createUser(
        httpRequest.body!
      );
      return {
        statusCode: 201,
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

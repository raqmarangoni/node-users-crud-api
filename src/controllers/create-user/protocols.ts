import { User } from "../../models/users";
import { HttpRequest, HttpResponse } from "../protocols";

export interface IcreateUserController {
  handle(
    httpRequest: HttpRequest<CreateUserParams>
  ): Promise<HttpResponse<User>>;
}

export interface CreateUserParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface IUpdateUserController {
  handle(httpRequest: httpRequest<unknown>): Promise<HttpResponse<User>>;
}

export interface ICreateUserRepository {
  createUser(params: CreateUserParams): Promise<User>;
}

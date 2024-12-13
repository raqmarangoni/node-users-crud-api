import { User } from "../../models/users";
import { HttpRequest, HttpResponse } from "../protocols";

export interface IDeleteUserController {
  handle(httpRequest: HttpRequest<unknown>): Promise<HttpResponse<User>>;
}
export interface IDeleteUserRepository {
  deleteUser(id: string): Promise<User>;
}
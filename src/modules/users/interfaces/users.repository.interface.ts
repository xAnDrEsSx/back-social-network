import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { IUser } from "./user.interface";

export interface IUsersRepository {
  createUser(user: CreateUserDto): Promise<IUser>;
  updateUser(userId: string, user: UpdateUserDto): Promise<IUser>;
  getUserById(userId: string): Promise<IUser | null>;
  getUserByUsername(username: string): Promise<IUser | null>;
  getUserByEmail(email: string): Promise<IUser | null>;
}
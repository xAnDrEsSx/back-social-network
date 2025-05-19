import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IUser } from '../interfaces/user.interface';
import { IUsersRepository } from '../interfaces/users.repository.interface';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject('IUsersRepository')
    private readonly usersRepository: IUsersRepository,
  ) {}

  async createUser(user: CreateUserDto): Promise<IUser> {
    user.passwordHash = await bcrypt.hash(user.passwordHash, 12);
    return this.usersRepository.createUser(user);
  }

  async getUserById(userId: string): Promise<IUser | null> {
    const user = await this.usersRepository.getUserById(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    return user;
  }

  async getUserByUsername(username: string): Promise<IUser | null> {
    const user = await this.usersRepository.getUserByUsername(username);
    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }
    return user;
  }

    async getUserByEmail(email: string): Promise<IUser> {
    const user = await this.usersRepository.getUserByEmail(email);
    if (!user) {
        throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
    }

  async updateUser(userId: string, user: UpdateUserDto): Promise<IUser> {
    if (user.passwordHash) {
      user.passwordHash = await bcrypt.hash(user.passwordHash, 12);
    }
    return this.usersRepository.updateUser(userId, user);
  }
}

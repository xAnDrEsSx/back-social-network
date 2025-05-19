import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { IUser } from '../interfaces/user.interface';
import { Repository } from 'typeorm';
import { IUsersRepository } from '../interfaces/users.repository.interface';
import { UpdateUserDto } from '../dto/update-user.dto';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(user: CreateUserDto): Promise<IUser> {
    return this.userRepository.save(user);
  }

  async updateUser(userId: string, user: UpdateUserDto): Promise<IUser> {
    await this.userRepository.update(userId, user);
    const updatedUser = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!updatedUser) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    return updatedUser;
  }

  async getUsers(): Promise<IUser[]> {
    return this.userRepository.find();
  }

  async getUserById(userId: string): Promise<IUser | null> {
    return this.userRepository.findOne({
      where: { id: userId },
    });
  }

  async getUserByUsername(username: string): Promise<IUser | null> {
    return this.userRepository.findOne({
      where: { username },
    });
  }

  async getUserByEmail(userEmail: string): Promise<IUser> {
    const user = await this.userRepository.findOne({
      where: { email: userEmail },
    });

    if (!user) {
      throw new NotFoundException(`User with email ${userEmail} not found`);
    }

    return user;
  }
}

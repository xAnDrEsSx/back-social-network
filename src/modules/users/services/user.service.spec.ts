import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { IUsersRepository } from '../interfaces/users.repository.interface';
import { NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

describe('UserService', () => {
  let service: UserService;
  let usersRepository: jest.Mocked<IUsersRepository>;

  const mockUser = {
    id: 'user-uuid',
    username: 'andres',
    firstName: 'Andrés',
    lastName: 'Medina',
    email: 'andres@example.com',
    passwordHash: 'hashedPassword',
    birthDate: new Date(),
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: 'IUsersRepository',
          useValue: {
            createUser: jest.fn(),
            getUserById: jest.fn(),
            getUserByUsername: jest.fn(),
            getUserByEmail: jest.fn(),
            updateUser: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    usersRepository = module.get('IUsersRepository');
  });


  it('should get a user by id', async () => {
    usersRepository.getUserById.mockResolvedValue(mockUser);
    const result = await service.getUserById('user-uuid');
    expect(result).toEqual(mockUser);
  });

  it('should throw if user by id is not found', async () => {
    usersRepository.getUserById.mockResolvedValue(null);
    await expect(service.getUserById('not-found')).rejects.toThrow(NotFoundException);
  });

  it('should get user by username', async () => {
    usersRepository.getUserByUsername.mockResolvedValue(mockUser);
    const result = await service.getUserByUsername('andres');
    expect(result).toEqual(mockUser);
  });

  it('should throw if user by username not found', async () => {
    usersRepository.getUserByUsername.mockResolvedValue(null);
    await expect(service.getUserByUsername('missing')).rejects.toThrow(NotFoundException);
  });

  it('should get user by email', async () => {
    usersRepository.getUserByEmail.mockResolvedValue(mockUser);
    const result = await service.getUserByEmail('andres@example.com');
    expect(result).toEqual(mockUser);
  });

  it('should throw if user by email not found', async () => {
    usersRepository.getUserByEmail.mockRejectedValue(new NotFoundException());
    await expect(service.getUserByEmail('notfound@example.com')).rejects.toThrow(NotFoundException);
  });

  it('should update user without password', async () => {
    const dto: UpdateUserDto = {};
    usersRepository.updateUser.mockResolvedValue(mockUser);

    const result = await service.updateUser('user-uuid', dto);
    expect(result).toEqual(mockUser);
  });
});

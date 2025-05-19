import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepository } from './users.repository';
import { UserEntity } from '../entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

const mockUserEntity = {
  id: 'user-uuid',
  username: 'andres',
  firstName: 'Andrés',
  lastName: 'Medina',
  email: 'andres@example.com',
  passwordHash: 'Password@123',
  birthDate: new Date('1990-01-01'),
  createdAt: new Date(),
};

describe('UsersRepository', () => {
  let repo: UsersRepository;
  let userRepo: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersRepository,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            save: jest.fn(),
            update: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    repo = module.get<UsersRepository>(UsersRepository);
    userRepo = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
  });

  it('should create a user', async () => {
    jest.spyOn(userRepo, 'save').mockResolvedValue(mockUserEntity as any);
    const result = await repo.createUser(mockUserEntity as any);
    expect(result).toEqual(mockUserEntity);
  });

  it('should update a user', async () => {
    jest.spyOn(userRepo, 'update').mockResolvedValue({} as any);
    jest.spyOn(userRepo, 'findOne').mockResolvedValue(mockUserEntity as any);
    const result = await repo.updateUser('user-uuid', { firstName: 'Carlos' } as any);
    expect(result).toEqual(mockUserEntity);
  });

  it('should throw if updated user not found', async () => {
    jest.spyOn(userRepo, 'update').mockResolvedValue({} as any);
    jest.spyOn(userRepo, 'findOne').mockResolvedValue(null);
    await expect(repo.updateUser('not-found-id', {} as any)).rejects.toThrow(NotFoundException);
  });

  it('should get all users', async () => {
    jest.spyOn(userRepo, 'find').mockResolvedValue([mockUserEntity] as any);
    const result = await repo.getUsers();
    expect(result).toHaveLength(1);
  });

  it('should get user by id', async () => {
    jest.spyOn(userRepo, 'findOne').mockResolvedValue(mockUserEntity as any);
    const result = await repo.getUserById('user-uuid');
    expect(result).toEqual(mockUserEntity);
  });

  it('should get user by username', async () => {
    jest.spyOn(userRepo, 'findOne').mockResolvedValue(mockUserEntity as any);
    const result = await repo.getUserByUsername('andres');
    expect(result).toEqual(mockUserEntity);
  });

  it('should get user by email', async () => {
    jest.spyOn(userRepo, 'findOne').mockResolvedValue(mockUserEntity as any);
    const result = await repo.getUserByEmail('andres@example.com');
    expect(result).toEqual(mockUserEntity);
  });

  it('should throw if user email not found', async () => {
    jest.spyOn(userRepo, 'findOne').mockResolvedValue(null);
    await expect(repo.getUserByEmail('no@found.com')).rejects.toThrow(NotFoundException);
  });
});

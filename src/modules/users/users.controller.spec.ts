import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controllers';
import { UserService } from './services/user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { IUser } from './interfaces/user.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { from } from 'rxjs';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UserService,
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

    controller = module.get<UsersController>(UsersController);
    userService = module.get<UserService>(UserService);
  });

  it('should create a user', (done) => {
    const dto: CreateUserDto = {
      firstName: 'Carlos',
      lastName: 'Medina',
      birthDate: new Date('1990-01-01'),
      username: 'cmedina',
      email: 'cmedina@example.com',
      passwordHash: 'Password@123',
    };

    const user: IUser = {
      id: 'uuid-123',
      ...dto,
      //posts: [],
      //likes: [],
      createdAt: new Date(),
    };

    jest.spyOn(userService, 'createUser').mockResolvedValue(user);

    const result = controller.create(dto);

    from(result).subscribe({
      next: (data) => {
        expect(data).toEqual(user);
        done();
      },
      error: done.fail,
    });
  });

  it('should get user by id', (done) => {
    const id = 'uuid-123';
    const user: IUser = {
      id,
      firstName: 'Carlos',
      lastName: 'Medina',
      birthDate: new Date('1990-01-01'),
      username: 'cmedina',
      email: 'cmedina@example.com',
      passwordHash: 'hashedpass',
      //posts: [],
      //likes: [],
      createdAt: new Date(),
    };

    jest.spyOn(userService, 'getUserById').mockResolvedValue(user);

    const result = controller.findOne(id);

    from(result).subscribe({
      next: (data) => {
        expect(data).toEqual(user);
        done();
      },
      error: done.fail,
    });
  });

  it('should throw NotFoundException if user not found by id', async () => {
    jest.spyOn(userService, 'getUserById').mockResolvedValue(null);

    await expect(controller.findOne('invalid-id')).rejects.toThrow(NotFoundException);
  });

  it('should get user by username', (done) => {
    const username = 'cmedina';
    const user: IUser = {
      id: 'uuid-123',
      firstName: 'Carlos',
      lastName: 'Medina',
      birthDate: new Date('1990-01-01'),
      username,
      email: 'cmedina@example.com',
      passwordHash: 'hashedpass',
      //posts: [],
      //likes: [],
      createdAt: new Date(),
    };

    jest.spyOn(userService, 'getUserByUsername').mockResolvedValue(user);

    const result = controller.getUserByUsername(username);

    from(result).subscribe({
      next: (data) => {
        expect(data).toEqual(user);
        done();
      },
      error: done.fail,
    });
  });

  it('should throw NotFoundException if user not found by username', async () => {
    jest.spyOn(userService, 'getUserByUsername').mockResolvedValue(null);

    await expect(controller.getUserByUsername('invalid-username')).rejects.toThrow(NotFoundException);
  });

  it('should get user by email', (done) => {
    const email = 'cmedina@example.com';
    const user: IUser = {
      id: 'uuid-123',
      firstName: 'Carlos',
      lastName: 'Medina',
      birthDate: new Date('1990-01-01'),
      username: 'cmedina',
      email,
      passwordHash: 'hashedpass',
      //posts: [],
      //likes: [],
      createdAt: new Date(),
    };

    jest.spyOn(userService, 'getUserByEmail').mockResolvedValue(user);

    const result = controller.getUserByEmail(email);

    from(result).subscribe({
      next: (data) => {
        expect(data).toEqual(user);
        done();
      },
      error: done.fail,
    });
  });

    it('should throw NotFoundException if user not found by email', async () => {
    jest.spyOn(userService, 'getUserByEmail').mockImplementation(() => {
        throw new NotFoundException('User not found');
    });

    await expect(controller.getUserByEmail('invalid@example.com')).rejects.toThrow(NotFoundException);
  });

  it('should update user', (done) => {
    const id = 'uuid-123';
    const dto: UpdateUserDto = {
      email: 'newemail@example.com',
      passwordHash: 'newpass',
    };

    const user: IUser = {
      id,
      firstName: 'Carlos',
      lastName: 'Medina',
      birthDate: new Date('1990-01-01'),
      username: 'cmedina',
      email: dto.email ?? 'default@example.com',
      passwordHash: 'hashednewpass',
      //posts: [],
      //likes: [],
      createdAt: new Date(),
    };

    jest.spyOn(userService, 'updateUser').mockResolvedValue(user);

    const result = controller.update(id, dto);

    from(result).subscribe({
      next: (data) => {
        expect(data).toEqual(user);
        done();
      },
      error: done.fail,
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { LikesService } from './likes.service';
import { LikesRepository } from '../repositories/likes.repository';
import { IUsersRepository } from '../../users/interfaces/users.repository.interface';
import { IPostsRepository } from '../../posts/interfaces/posts.repository.interface';
import { NotFoundException } from '@nestjs/common';
import { CreateLikeDto } from '../dto/create-like.dto';

describe('LikesService', () => {
  let service: LikesService;
  let likesRepo: jest.Mocked<LikesRepository>;
  let usersRepo: jest.Mocked<IUsersRepository>;
  let postsRepo: jest.Mocked<IPostsRepository>;

  const mockLike = { id: 'like-id' } as any;
  const mockUser = { id: 'user-id' } as any;
  const mockPost = { id: 'post-id' } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LikesService,
        {
          provide: LikesRepository,
          useValue: {
            createLike: jest.fn(),
            deleteLike: jest.fn(),
          },
        },
        {
          provide: 'IUsersRepository',
          useValue: {
            getUserById: jest.fn(),
          },
        },
        {
          provide: 'IPostsRepository',
          useValue: {
            getPostById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<LikesService>(LikesService);
    likesRepo = module.get(LikesRepository);
    usersRepo = module.get('IUsersRepository');
    postsRepo = module.get('IPostsRepository');
  });

  it('should create a like if user and post exist', async () => {
    const dto: CreateLikeDto = { userId: 'user-id', postId: 'post-id' };
    usersRepo.getUserById.mockResolvedValue(mockUser);
    postsRepo.getPostById.mockResolvedValue(mockPost);
    likesRepo.createLike.mockResolvedValue(mockLike);

    const result = await service.create(dto);
    expect(result).toEqual(mockLike);
    expect(usersRepo.getUserById).toHaveBeenCalledWith('user-id');
    expect(postsRepo.getPostById).toHaveBeenCalledWith('post-id');
    expect(likesRepo.createLike).toHaveBeenCalledWith(dto);
  });

  it('should throw NotFoundException if user not found', async () => {
    const dto: CreateLikeDto = { userId: 'user-id', postId: 'post-id' };
    usersRepo.getUserById.mockResolvedValue(null);

    await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    expect(usersRepo.getUserById).toHaveBeenCalledWith('user-id');
  });

  it('should throw NotFoundException if post not found', async () => {
    const dto: CreateLikeDto = { userId: 'user-id', postId: 'post-id' };
    usersRepo.getUserById.mockResolvedValue(mockUser);
    postsRepo.getPostById.mockResolvedValue(null);

    await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    expect(postsRepo.getPostById).toHaveBeenCalledWith('post-id');
  });

  it('should remove a like', async () => {
    await service.remove('user-id', 'post-id');
    expect(likesRepo.deleteLike).toHaveBeenCalledWith('user-id', 'post-id');
  });
});

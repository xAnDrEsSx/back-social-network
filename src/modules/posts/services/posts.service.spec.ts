import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { PostsRepository } from '../repositories/posts.repository';
import { IUsersRepository } from '../../users/interfaces/users.repository.interface';
import { NotFoundException } from '@nestjs/common';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';

describe('PostsService', () => {
  let service: PostsService;
  let postsRepo: jest.Mocked<PostsRepository>;
  let usersRepo: jest.Mocked<IUsersRepository>;

  const mockPost = { id: 'post-id', message: 'Hello world' } as any;
  const mockUser = { id: 'user-id' } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: PostsRepository,
          useValue: {
            createPost: jest.fn(),
            getPaginatedPosts: jest.fn(),
            getAllPosts: jest.fn(),
            getPostById: jest.fn(),
            updatePost: jest.fn(),
            deletePost: jest.fn(),
          },
        },
        {
          provide: 'IUsersRepository',
          useValue: {
            getUserById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    postsRepo = module.get(PostsRepository);
    usersRepo = module.get('IUsersRepository');
  });

  it('should create a post if user exists', async () => {
    const dto: CreatePostDto = { message: 'Hello world', userId: 'user-id' };
    usersRepo.getUserById.mockResolvedValue(mockUser);
    postsRepo.createPost.mockResolvedValue(mockPost);

    const result = await service.create(dto);
    expect(result).toEqual(mockPost);
    expect(usersRepo.getUserById).toHaveBeenCalledWith('user-id');
    expect(postsRepo.createPost).toHaveBeenCalledWith(dto);
  });

  it('should throw NotFoundException if user not found on create', async () => {
    const dto: CreatePostDto = { message: 'Hello world', userId: 'user-id' };
    usersRepo.getUserById.mockResolvedValue(null);

    await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    expect(usersRepo.getUserById).toHaveBeenCalledWith('user-id');
  });

  it('should return paginated posts', async () => {
    const mockPagination = { data: [mockPost], total: 1, page: 1, lastPage: 1 };
    postsRepo.getPaginatedPosts.mockResolvedValue(mockPagination);

    const result = await service.getPaginated(1, 10);
    expect(result).toEqual(mockPagination);
    expect(postsRepo.getPaginatedPosts).toHaveBeenCalledWith(1, 10);
  });

  it('should return all posts', async () => {
    postsRepo.getAllPosts.mockResolvedValue([mockPost]);

    const result = await service.findAll();
    expect(result).toEqual([mockPost]);
  });

  it('should return one post by id', async () => {
    postsRepo.getPostById.mockResolvedValue(mockPost);

    const result = await service.findOne('post-id');
    expect(result).toEqual(mockPost);
  });

  it('should update a post by id', async () => {
    const dto: UpdatePostDto = { message: 'Updated' };
    postsRepo.updatePost.mockResolvedValue({ ...mockPost, ...dto });

    const result = await service.update('post-id', dto);
    expect(result).toEqual({ ...mockPost, ...dto });
  });

  it('should delete a post by id', async () => {
    await service.remove('post-id');
    expect(postsRepo.deletePost).toHaveBeenCalledWith('post-id');
  });
});

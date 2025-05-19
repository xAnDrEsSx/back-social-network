import { Test, TestingModule } from '@nestjs/testing';
import { PostsRepository } from './posts.repository';
import { PostEntity } from '../entities/posts.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

const mockPostEntity = {
  id: 'post-uuid',
  message: 'Hello world',
  publishedAt: new Date(),
  user: {
    id: 'user-uuid',
    username: 'andres',
    firstName: 'Andrés',
    lastName: 'Medina',
    birthDate: new Date(),
    email: 'andres@example.com',
    passwordHash: 'hashedPass',
    createdAt: new Date(),
  },
  likes: [],
};

describe('PostsRepository', () => {
  let repo: PostsRepository;
  let postRepo: Repository<PostEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsRepository,
        {
          provide: getRepositoryToken(PostEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
            update: jest.fn(),
            find: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnValue({
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              loadRelationCountAndMap: jest.fn().mockReturnThis(),
              select: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              skip: jest.fn().mockReturnThis(),
              take: jest.fn().mockReturnThis(),
              getManyAndCount: jest.fn().mockResolvedValue([[mockPostEntity], 1]),
            }),
          },
        },
      ],
    }).compile();

    repo = module.get<PostsRepository>(PostsRepository);
    postRepo = module.get<Repository<PostEntity>>(getRepositoryToken(PostEntity));
  });

  it('should create a post', async () => {
    jest.spyOn(postRepo, 'create').mockReturnValue(mockPostEntity as any);
    jest.spyOn(postRepo, 'save').mockResolvedValue(mockPostEntity);

    const result = await repo.createPost({ message: 'Hello world', userId: 'user-uuid' } as any);
    expect(result).toEqual(mockPostEntity);
  });

  it('should paginate posts', async () => {
    const result = await repo.getPaginatedPosts(1, 10);
    expect(result.data).toHaveLength(1);
    expect(result.total).toBe(1);
  });

  it('should update a post', async () => {
    jest.spyOn(postRepo, 'update').mockResolvedValue({} as any);
    jest.spyOn(postRepo, 'findOne').mockResolvedValue(mockPostEntity as any);

    const result = await repo.updatePost('post-uuid', { message: 'Updated' } as any);
    expect(result).toEqual(mockPostEntity);
  });

  it('should throw if updated post not found', async () => {
    jest.spyOn(postRepo, 'update').mockResolvedValue({} as any);
    jest.spyOn(postRepo, 'findOne').mockResolvedValue(null);

    await expect(repo.updatePost('not-found-id', { message: 'text' } as any)).rejects.toThrow(NotFoundException);
  });

  it('should get post by id', async () => {
    jest.spyOn(postRepo, 'findOne').mockResolvedValue(mockPostEntity as any);
    const result = await repo.getPostById('post-uuid');
    expect(result).toEqual(mockPostEntity);
  });

  it('should get all posts', async () => {
    jest.spyOn(postRepo, 'find').mockResolvedValue([mockPostEntity] as any);
    const result = await repo.getAllPosts();
    expect(result).toHaveLength(1);
  });

  it('should delete a post', async () => {
    const spy = jest.spyOn(postRepo, 'delete').mockResolvedValue({} as any);
    await repo.deletePost('post-uuid');
    expect(spy).toHaveBeenCalledWith('post-uuid');
  });
});

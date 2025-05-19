import { Test, TestingModule } from '@nestjs/testing';
import { LikesRepository } from './likes.repository';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LikeEntity } from '../entities/likes.entity';
import { CreateLikeDto } from '../dto/create-like.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('LikesRepository', () => {
  let likesRepo: LikesRepository;
  let mockRepo: jest.Mocked<Repository<LikeEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LikesRepository,
        {
          provide: getRepositoryToken(LikeEntity),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
            delete: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    likesRepo = module.get<LikesRepository>(LikesRepository);
    mockRepo = module.get(getRepositoryToken(LikeEntity));
  });

  it('should create a new like if it does not exist', async () => {
    const dto: CreateLikeDto = { userId: 'user-1', postId: 'post-1' };
    const newLike = { id: 'like-1', user: { id: 'user-1' }, post: { id: 'post-1' } } as LikeEntity;

    mockRepo.findOne.mockResolvedValue(null);
    mockRepo.create.mockReturnValue(newLike);
    mockRepo.save.mockResolvedValue(newLike);

    const result = await likesRepo.createLike(dto);

    expect(mockRepo.findOne).toHaveBeenCalledWith({
      where: { user: { id: dto.userId }, post: { id: dto.postId } },
    });
    expect(mockRepo.create).toHaveBeenCalledWith({ user: { id: dto.userId }, post: { id: dto.postId } });
    expect(mockRepo.save).toHaveBeenCalledWith(newLike);
    expect(result).toEqual(newLike);
  });

  it('should remove existing like if already exists', async () => {
    const dto: CreateLikeDto = { userId: 'user-1', postId: 'post-1' };
    const existingLike = { id: 'like-1' } as LikeEntity;

    mockRepo.findOne.mockResolvedValue(existingLike);
    mockRepo.remove.mockResolvedValue(existingLike);

    const result = await likesRepo.createLike(dto);

    expect(mockRepo.remove).toHaveBeenCalledWith(existingLike);
    expect(result).toEqual(existingLike);
  });

  it('should delete a like if it exists', async () => {
    const like = { id: 'like-1' } as LikeEntity;

    mockRepo.findOne.mockResolvedValue(like);
    mockRepo.delete.mockResolvedValue({} as any);

    await expect(likesRepo.deleteLike('user-1', 'post-1')).resolves.toBeUndefined();
    expect(mockRepo.delete).toHaveBeenCalledWith('like-1');
  });

  it('should throw NotFoundException if like does not exist when deleting', async () => {
    mockRepo.findOne.mockResolvedValue(null);

    await expect(likesRepo.deleteLike('user-1', 'post-1')).rejects.toThrow(NotFoundException);
  });

  it('should return like by user and post', async () => {
    const like = { id: 'like-1' } as LikeEntity;

    mockRepo.findOne.mockResolvedValue(like);

    const result = await likesRepo.getLikeByUserAndPost('user-1', 'post-1');
    expect(result).toEqual(like);
  });

  it('should return all likes for a post', async () => {
    const likes = [{ id: 'like-1' }, { id: 'like-2' }] as LikeEntity[];

    mockRepo.find.mockResolvedValue(likes);

    const result = await likesRepo.getAllLikesByPost('post-1');
    expect(result).toEqual(likes);
    expect(mockRepo.find).toHaveBeenCalledWith({
      where: { post: { id: 'post-1' } },
      relations: ['user'],
    });
  });
});

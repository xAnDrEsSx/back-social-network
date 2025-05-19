import { Test, TestingModule } from '@nestjs/testing';
import { LikesController } from './likes.controller';
import { LikesService } from './services/likes.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { LikeEntity } from './entities/likes.entity';

describe('LikesController', () => {
  let controller: LikesController;
  let service: LikesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LikesController],
      providers: [
        {
          provide: LikesService,
          useValue: {
            create: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<LikesController>(LikesController);
    service = module.get<LikesService>(LikesService);
  });

  it('should create a like', async () => {
    const dto: CreateLikeDto = {
      userId: 'user-uuid',
      postId: 'post-uuid',
    };
    const result: LikeEntity = {
      id: 'like-uuid',
      user: { id: 'user-uuid' } as any,
      post: { id: 'post-uuid' } as any,
      likedAt: new Date(),
    };
    jest.spyOn(service, 'create').mockResolvedValue(result);

    await expect(controller.create(dto)).resolves.toEqual(result);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should remove a like', async () => {
    const userId = 'user-uuid';
    const postId = 'post-uuid';
    jest.spyOn(service, 'remove').mockResolvedValue(undefined);

    await expect(controller.remove(userId, postId)).resolves.toBeUndefined();
    expect(service.remove).toHaveBeenCalledWith(userId, postId);
  });
});

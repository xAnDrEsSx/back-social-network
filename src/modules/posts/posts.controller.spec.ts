import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './services/posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { IPost } from './interfaces/post.interface';

describe('PostsController', () => {
  let controller: PostsController;
  let service: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        {
          provide: PostsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PostsController>(PostsController);
    service = module.get<PostsService>(PostsService);
  });

  it('should create a post', async () => {
    const dto: CreatePostDto = {
      userId: 'user-uuid',
      message: 'Hello World',
    };
    const result: IPost = {
      id: 'post-uuid',
      user: { id: 'user-uuid', /*...*/ } as any,
      message: 'Hello World',
      publishedAt: new Date(),
      likes: [],
    };
    jest.spyOn(service, 'create').mockResolvedValue(result);

    await expect(controller.create(dto)).resolves.toEqual(result);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should return all posts', async () => {
    const result: IPost[] = [];
    jest.spyOn(service, 'findAll').mockResolvedValue(result);

    await expect(controller.findAll()).resolves.toEqual(result);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return a post by id', async () => {
    const id = 'post-uuid';
    const result: IPost = {
      id,
      user: { id: 'user-uuid' } as any,
      message: 'Hello',
      publishedAt: new Date(),
      likes: [],
    };
    jest.spyOn(service, 'findOne').mockResolvedValue(result);

    await expect(controller.findOne(id)).resolves.toEqual(result);
    expect(service.findOne).toHaveBeenCalledWith(id);
  });

  it('should update a post', async () => {
    const id = 'post-uuid';
    const dto: UpdatePostDto = { message: 'Updated' };
    const result: IPost = {
      id,
      user: { id: 'user-uuid' } as any,
      message: 'Updated',
      publishedAt: new Date(),
      likes: [],
    };
    jest.spyOn(service, 'update').mockResolvedValue(result);

    await expect(controller.update(id, dto)).resolves.toEqual(result);
    expect(service.update).toHaveBeenCalledWith(id, dto);
  });

  it('should remove a post', async () => {
    const id = 'post-uuid';
    jest.spyOn(service, 'remove').mockResolvedValue(undefined);

    await expect(controller.remove(id)).resolves.toBeUndefined();
    expect(service.remove).toHaveBeenCalledWith(id);
  });
});

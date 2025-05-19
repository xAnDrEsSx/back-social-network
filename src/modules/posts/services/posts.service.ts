import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PostsRepository } from '../repositories/posts.repository';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { IUsersRepository } from '../../users/interfaces/users.repository.interface';

@Injectable()
export class PostsService {
  constructor(
    private readonly postsRepo: PostsRepository,
    @Inject('IUsersRepository')
    private readonly usersRepo: IUsersRepository,
  ) {}

  async create(dto: CreatePostDto) {
    const user = await this.usersRepo.getUserById(dto.userId);
    if (!user) throw new NotFoundException('User not found');

    return this.postsRepo.createPost(dto);
  }

  async getPaginated(page?: number, limit?: number) {
    const pageNumber = page && page > 0 ? page : 1;
    const limitNumber = limit && limit > 0 ? limit : 10;
    return this.postsRepo.getPaginatedPosts(pageNumber, limitNumber);
  }

  findAll() {
    return this.postsRepo.getAllPosts();
  }

  findOne(id: string) {
    return this.postsRepo.getPostById(id);
  }

  update(id: string, dto: UpdatePostDto) {
    return this.postsRepo.updatePost(id, dto);
  }

  remove(id: string) {
    return this.postsRepo.deletePost(id);
  }
}

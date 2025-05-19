import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { LikesRepository } from '../repositories/likes.repository';
import { CreateLikeDto } from '../dto/create-like.dto';
import { IUsersRepository } from '../../users/interfaces/users.repository.interface';
import { IPostsRepository } from '../../posts/interfaces/posts.repository.interface';

@Injectable()
export class LikesService {
  constructor(
    private readonly likesRepo: LikesRepository,
    @Inject('IUsersRepository')
    private readonly usersRepo: IUsersRepository,
    @Inject('IPostsRepository')
    private readonly postsRepo: IPostsRepository,
  ) {}

  async create(dto: CreateLikeDto) {
    const user = await this.usersRepo.getUserById(dto.userId);
    if (!user) throw new NotFoundException('User not found');

    const post = await this.postsRepo.getPostById(dto.postId);
    if (!post) throw new NotFoundException('Post not found');

    return this.likesRepo.createLike(dto);
  }

  async remove(userId: string, postId: string) {
    return this.likesRepo.deleteLike(userId, postId);
  }
}

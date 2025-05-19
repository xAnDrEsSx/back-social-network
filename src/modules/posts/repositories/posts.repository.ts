import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from '../entities/posts.entity';
import { IPost } from '../interfaces/post.interface';
import { Repository } from 'typeorm';
import { IPostsRepository } from '../interfaces/posts.repository.interface';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';

@Injectable()
export class PostsRepository implements IPostsRepository {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}

  async createPost(post: CreatePostDto): Promise<IPost> {
    const newPost = this.postRepository.create(post);
    return this.postRepository.save(newPost);
  }

  async getPaginatedPosts(page = 1, limit = 10): Promise<{
    data: IPost[];
    total: number;
    page: number;
    lastPage: number;
  }> {
    if (page < 1) page = 1;
    if (limit < 1) limit = 10;

    const skip = (page - 1) * limit;

    const qb = this.postRepository.createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .loadRelationCountAndMap('post.likesCount', 'post.likes')
      .select([
        'post.id',
        'post.message',
        'post.publishedAt',
        'user.id',
        'user.username',
        'user.firstName',
        'user.lastName',
      ])
      .orderBy('post.publishedAt', 'DESC')
      .skip(skip)
      .take(limit);

    const [posts, total] = await qb.getManyAndCount();

    return {
      data: posts,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }



  async updatePost(postId: string, post: UpdatePostDto): Promise<IPost> {
    await this.postRepository.update(postId, post);
    const updatedPost = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['user', 'likes'],
    });

    if (!updatedPost) {
      throw new NotFoundException(`Post with id ${postId} not found`);
    }

    return updatedPost;
  }

  async getPostById(postId: string): Promise<IPost | null> {
    return this.postRepository.findOne({
      where: { id: postId },
      relations: ['user', 'likes'],
    });
  }

  async getAllPosts(): Promise<IPost[]> {
    return this.postRepository.find({
      relations: ['user', 'likes'],
    });
  }

  async deletePost(postId: string): Promise<void> {
    await this.postRepository.delete(postId);
  }
}

import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LikeEntity } from '../entities/likes.entity';
import { Repository } from 'typeorm';
import { CreateLikeDto } from '../dto/create-like.dto';
import { ILikesRepository } from '../interfaces/likes.repository.interface';

@Injectable()
export class LikesRepository implements ILikesRepository {
  constructor(
    @InjectRepository(LikeEntity)
    private readonly likeRepository: Repository<LikeEntity>,
  ) {}

  async createLike(dto: CreateLikeDto): Promise<LikeEntity> {

    const { userId, postId } = dto;

    const existing = await this.likeRepository.findOne({
      where: { user: { id: userId }, post: { id: postId } },
    });

    if (existing) {
      //throw new ConflictException('User already liked this post');
      return await this.likeRepository.remove(existing);
    }

    const like = this.likeRepository.create({
      user: { id: userId },
      post: { id: postId },
    });

    return this.likeRepository.save(like);
  }

  async deleteLike(userId: string, postId: string): Promise<void> {
    const like = await this.likeRepository.findOne({
      where: { user: { id: userId }, post: { id: postId } },
    });

    if (!like) {
      throw new NotFoundException('Like not found');
    }

    await this.likeRepository.delete(like.id);
  }

  async getLikeByUserAndPost(userId: string, postId: string): Promise<LikeEntity | null> {
    return this.likeRepository.findOne({
      where: { user: { id: userId }, post: { id: postId } },
    });
  }

  async getAllLikesByPost(postId: string): Promise<LikeEntity[]> {
    return this.likeRepository.find({
      where: { post: { id: postId } },
      relations: ['user'],
    });
  }
}

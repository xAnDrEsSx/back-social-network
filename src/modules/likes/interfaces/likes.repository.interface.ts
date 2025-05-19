import { CreateLikeDto } from '../dto/create-like.dto';
import { ILike } from './like.interface';

export interface ILikesRepository {
  createLike(dto: CreateLikeDto): Promise<ILike>;
  deleteLike(userId: string, postId: string): Promise<void>;
  getLikeByUserAndPost(userId: string, postId: string): Promise<ILike | null>;
  getAllLikesByPost(postId: string): Promise<ILike[]>;
}

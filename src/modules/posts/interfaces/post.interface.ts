import { UserEntity } from '../../users/entities/user.entity';
import { LikeEntity } from '../../likes/entities/likes.entity';

export interface IPost {
  id: string;
  user: UserEntity;
  message: string;
  publishedAt: Date;
  likes?: LikeEntity[];
}

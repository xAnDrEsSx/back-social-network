import { UserEntity } from '../../users/entities/user.entity';
import { PostEntity } from '../../posts/entities/posts.entity';

export interface ILike {
  id: string;
  user: UserEntity;
  post: PostEntity;
  likedAt: Date;
}

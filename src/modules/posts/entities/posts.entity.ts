import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { LikeEntity } from '../../likes/entities/likes.entity';

@Entity('posts', { schema: 'public' })
export class PostEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.posts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ type: 'text' })
  message: string;

  @CreateDateColumn({ name: 'published_at' })
  publishedAt: Date;

  @OneToMany(() => LikeEntity, (like) => like.post)
  likes?: LikeEntity[];
}

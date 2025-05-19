import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PostEntity } from '../../posts/entities/posts.entity';
import { LikeEntity } from '../../likes/entities/likes.entity';
import { Exclude } from 'class-transformer';


@Index('email_unique', ['email'], { unique: true })
@Index('username_unique', ['username'], { unique: true })
@Entity('users', { schema: 'public' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'first_name', type: 'varchar', length: 100 })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar', length: 100 })
  lastName: string;

  @Column({ name: 'birth_date', type: 'date' })
  birthDate: Date;

  @Column({ name: 'username', type: 'varchar', length: 50 })
  username: string;

  @Column({ name: 'email', type: 'varchar', length: 100 })
  email: string;

  @Exclude()
  @Column({ name: 'password_hash', type: 'text' })
  passwordHash: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => PostEntity, (post) => post.user)
  posts?: PostEntity[];

  @OneToMany(() => LikeEntity, (like) => like.user)
  likes?: LikeEntity[];
}

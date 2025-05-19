import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './entities/posts.entity';
import { PostsRepository } from './repositories/posts.repository';
import { PostsService } from './services/posts.service';
import { PostsController } from './posts.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostEntity]),
    UsersModule,
  ],
  controllers: [PostsController],
  providers: [
    PostsRepository,
    PostsService,
    {
      provide: 'IPostsRepository',
      useClass: PostsRepository,
    },
  ],
  exports: [
    PostsRepository,
    PostsService,
    {
      provide: 'IPostsRepository',
      useClass: PostsRepository,
    },
  ],
})
export class PostsModule {}

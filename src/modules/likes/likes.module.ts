import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikeEntity } from './entities/likes.entity';
import { LikesRepository } from './repositories/likes.repository';
import { LikesService } from './services/likes.service';
import { LikesController } from './likes.controller';
import { UsersModule } from '../users/users.module';
import { PostsModule } from '../posts/posts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LikeEntity]),
    UsersModule,
    PostsModule,
  ],
  controllers: [LikesController],
  providers: [
    LikesRepository,
    LikesService,
  ],
  exports: [LikesRepository, LikesService],
})
export class LikesModule {}


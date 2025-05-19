import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { PostsModule } from './modules/posts/posts.module';
import { LikesModule } from './modules/likes/likes.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GlobalExceptionFilter } from './filters/global-error.filter';
import { TypeORMExceptionFilter } from './filters/typeorm-error.filter';
import { SeederService } from './seeder/seeder.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
      envFilePath: `environments/.env.${process.env.NODE_ENV ?? 'dev'}`,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    AuthModule,
    UsersModule,
    DatabaseModule,
    ConfigModule,
    PostsModule,
    LikesModule,
  ],
  controllers: [],
  providers: [
    SeederService,
    {
      provide: "APP_FILTER",
      useClass: GlobalExceptionFilter,
    },
    {
      provide: "APP_FILTER",
      useClass: TypeORMExceptionFilter,
    },
  ],
})
export class AppModule {}

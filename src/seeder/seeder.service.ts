import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { UserService } from '../modules/users/services/user.service';
import { PostsService } from '../modules/posts/services/posts.service';
import { LikesService } from '../modules/likes/services/likes.service';
import { ConfigService } from '@nestjs/config';
import { IUser } from 'src/modules/users/interfaces/user.interface';
import { IPost } from 'src/modules/posts/interfaces/post.interface';

@Injectable()
export class SeederService implements OnApplicationBootstrap {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly postsService: PostsService,
    private readonly likesService: LikesService,
  ) {}

  async onApplicationBootstrap() {
    const runSeeder = this.configService.get<string>('SEED_ENABLED');
    if (runSeeder !== 'true') return;

    const usersToSeed = [
      {
        firstName: 'Andrés',
        lastName: 'Medina',
        username: 'andres',
        email: 'andres@example.com',
        passwordHash: 'Password@123',
        birthDate: new Date('1990-01-01'),
      },
      {
        firstName: 'María',
        lastName: 'Gómez',
        username: 'maria',
        email: 'maria@example.com',
        passwordHash: 'Password@123',
        birthDate: new Date('1992-06-10'),
      },
      {
        firstName: 'Juan',
        lastName: 'Rodríguez',
        username: 'juan',
        email: 'juan@example.com',
        passwordHash: 'Password@123',
        birthDate: new Date('1991-03-15'),
      },
      {
        firstName: 'Laura',
        lastName: 'Martínez',
        username: 'laura',
        email: 'laura@example.com',
        passwordHash: 'Password@123',
        birthDate: new Date('1989-07-20'),
      },
    ];

    const createdUsers: IUser[] = [];

    for (const dto of usersToSeed) {
      const user = await this.userService.createUser(dto);
      createdUsers.push(user);
    }

    const messages = [
      'Este es mi primer post!',
      'NestJS es genial!',
      'Hola comunidad!',
      'Practicando con likes ',
      'Practicando para la prueba',
    ];

    const createdPosts: IPost[] = [];

    for (const msg of messages) {
      const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      const post = await this.postsService.create({ userId: randomUser.id, message: msg });
      createdPosts.push(post);
    }

    // Likes aleatorios
    for (const post of createdPosts) {
      const likeCount = Math.floor(Math.random() * createdUsers.length);
      const shuffled = createdUsers.sort(() => 0.5 - Math.random());
      const likers = shuffled.slice(0, likeCount);

      for (const liker of likers) {
        await this.likesService.create({ userId: liker.id, postId: post.id });
      }
    }

    console.log(' Seeder ejecutado correctamente.');
  }
}

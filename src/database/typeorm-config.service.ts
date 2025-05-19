import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get<string>('DB_HOST'),
      port: +this.configService.get<number>('DB_PORT')!,
      username: this.configService.get<string>('DB_USERNAME'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_NAME'),
      entities: [__dirname + '/../modules/**/entities/*.entity{.ts,.js}'],
      migrations: [__dirname + '/src/database/migrations/*{.ts,.js}'],
      synchronize: false,
      logging: true,
      ssl: this.configService.get<string>('DB_SSL') === 'true'
        ? { rejectUnauthorized: false }
        : false,
    };
  }
}


import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'Andres' })
  firstName: string;

  @ApiProperty({ example: 'Medina' })
  lastName: string;

  @ApiProperty({ example: '1990-01-01T00:00:00.000Z' })
  birthDate: Date;

  @ApiProperty({ example: 'cmedina' })
  username: string;

  @ApiProperty({ example: 'cmedina@yopmail.com' })
  email: string;

  @ApiProperty({ example: 'Password@123' })
  passwordHash: string;
}

import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'cmedina' })
  username: string;

  @ApiProperty({ example: 'Password@123' })
  password: string;
}

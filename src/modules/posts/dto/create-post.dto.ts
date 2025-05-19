import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  message: string;
}

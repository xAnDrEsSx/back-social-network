import { ApiProperty } from '@nestjs/swagger';

export class CreateLikeDto {
  @ApiProperty({ example: 'uuid-user' })
  userId: string;

  @ApiProperty({ example: 'uuid-post' })
  postId: string;
}

import {
  Body,
  Controller,
  Delete,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LikesService } from './services/likes.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('likes')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@ApiTags('Likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a like for a post' })
  @ApiResponse({ status: 201, description: 'Like toggled successfully' })
  @ApiBody({ type: CreateLikeDto })
  create(@Body() dto: CreateLikeDto) {
    return this.likesService.create(dto);
  }

  @Delete()
  @ApiOperation({ summary: 'Remove a like from a post' })
  @ApiResponse({ status: 200, description: 'Like removed successfully' })
  remove(@Query('userId') userId: string, @Query('postId') postId: string) {
    if (!userId || !postId) {
      throw new NotFoundException('userId and postId query params are required');
    }
    return this.likesService.remove(userId, postId);
  }
}

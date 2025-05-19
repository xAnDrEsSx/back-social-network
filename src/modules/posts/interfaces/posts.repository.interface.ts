import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { IPost } from './post.interface';

export interface IPostsRepository {
  createPost(post: CreatePostDto): Promise<IPost>;
  updatePost(postId: string, post: UpdatePostDto): Promise<IPost>;
  getPostById(postId: string): Promise<IPost | null>;
  getAllPosts(): Promise<IPost[]>;
  deletePost(postId: string): Promise<void>;
  getPaginatedPosts(page?: number, limit?: number): Promise<{
    data: IPost[];
    total: number;
    page: number;
    lastPage: number;
  }>;
}

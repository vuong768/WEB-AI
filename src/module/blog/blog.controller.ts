import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { BlogService } from './blog.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/role.guard';
import { CreateBlogDto, UpdateBlogDto } from './dto/blog.dto';

@ApiTags('Blog')
@ApiBearerAuth('access-token')
@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  // Lấy tất cả blog - không cần kiểm tra vai trò
  @Get()
  @ApiOperation({ summary: 'Lấy danh sách blog' })
  async getAllBlogs() {
    return this.blogService.getAllBlogs();
  }

  // Lấy blog theo ID - không cần kiểm tra vai trò
  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết blog theo ID' })
  async getBlogById(@Param('id') id: string) {
    return this.blogService.getBlogById(id);
  }

  // Tạo blog - yêu cầu vai trò admin
  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOperation({ summary: 'Tạo blog (Admin)' })
  async createBlog(@Body() createBlogDto: CreateBlogDto, @Req() req: any) {
    const authorId = req.user.id; // Lấy ID từ token
    return this.blogService.createBlog(createBlogDto, authorId);
  }

  // Cập nhật blog - yêu cầu vai trò admin
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOperation({ summary: 'Cập nhật blog (Admin)' })
  async updateBlog(
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
  ) {
    return this.blogService.updateBlog(id, updateBlogDto);
  }

  // Xóa blog - yêu cầu vai trò admin
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOperation({ summary: 'Xóa blog (Admin)' })
  async deleteBlog(@Param('id') id: string) {
    return this.blogService.deleteBlog(id);
  }
}

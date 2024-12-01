import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BlogService {
  constructor(private readonly prisma: PrismaService) {}

  // Lấy tất cả blog
  async getAllBlogs() {
    try {
      const blogs = await this.prisma.blog.findMany({
        include: { author: true },
      });

      return {
        status: 'success',
        message: 'Lấy danh sách blog thành công',
        data: blogs.map((blog) => ({
          ...blog,
          author: blog.author || null, // Xử lý trường hợp author null
        })),
      };
    } catch (error) {
      console.error(
        '[BlogService][getAllBlogs] Lỗi khi lấy danh sách blog:',
        error.message,
      );
      throw new InternalServerErrorException(
        'Có lỗi xảy ra khi lấy danh sách blog.',
      );
    }
  }

  // Lấy blog theo ID
  async getBlogById(id: string) {
    try {
      const blog = await this.prisma.blog.findUnique({
        where: { id },
        include: { author: true }, // Include thông tin tác giả
      });

      if (!blog) {
        throw new NotFoundException('Không tìm thấy blog với ID đã cho');
      }

      return {
        status: 'success',
        message: 'Lấy chi tiết blog thành công',
        data: blog,
      };
    } catch (error) {
      console.error('Lỗi khi lấy blog theo ID:', error.message);
      throw new InternalServerErrorException('Có lỗi xảy ra khi lấy blog');
    }
  }

  // Tạo blog
  async createBlog(data: any, authorId: string) {
    try {
      const { title, content, imageUrl } = data;

      // Kiểm tra blog trùng tiêu đề cho tác giả này
      const existingBlog = await this.prisma.blog.findFirst({
        where: {
          title,
          authorId, // Kiểm tra trùng theo tác giả
        },
      });

      if (existingBlog) {
        throw new BadRequestException(
          `Blog với tiêu đề "${title}" đã tồn tại bởi tác giả này.`,
        );
      }

      const blog = await this.prisma.blog.create({
        data: {
          title,
          content,
          imageUrl,
          authorId, // Gắn ID tác giả vào
        },
      });

      return {
        status: 'success',
        message: 'Tạo blog thành công',
        data: blog,
      };
    } catch (error) {
      console.error('Lỗi khi tạo blog:', error.message);
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Có lỗi xảy ra khi tạo blog');
    }
  }

  // Cập nhật blog
  async updateBlog(id: string, data: any) {
    try {
      const blog = await this.prisma.blog.update({
        where: { id },
        data,
      });

      return {
        status: 'success',
        message: 'Cập nhật blog thành công',
        data: blog,
      };
    } catch (error) {
      console.error('Lỗi khi cập nhật blog:', error.message);
      throw new InternalServerErrorException('Có lỗi xảy ra khi cập nhật blog');
    }
  }

  // Xóa blog
  async deleteBlog(id: string) {
    try {
      await this.prisma.blog.delete({ where: { id } });

      return {
        status: 'success',
        message: 'Xóa blog thành công',
      };
    } catch (error) {
      console.error('Lỗi khi xóa blog:', error.message);
      throw new InternalServerErrorException('Có lỗi xảy ra khi xóa blog');
    }
  }
}

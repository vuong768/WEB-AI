import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllCategories() {
    try {
      const categories = await this.prisma.category.findMany();
      return {
        status: 'success',
        message: 'Lấy danh sách danh mục thành công',
        data: categories,
      };
    } catch (error) {
      console.error('Lỗi khi lấy danh sách danh mục:', error.message);
      throw new InternalServerErrorException(
        'Có lỗi xảy ra khi lấy danh sách danh mục',
      );
    }
  }

  async getCategoryById(id: string) {
    try {
      const category = await this.prisma.category.findUnique({
        where: { id },
      });

      if (!category) {
        throw new NotFoundException('Không tìm thấy danh mục với ID đã cho');
      }

      return {
        status: 'success',
        message: 'Lấy chi tiết danh mục thành công',
        data: category,
      };
    } catch (error) {
      console.error('Lỗi khi lấy danh mục theo ID:', error.message);
      throw new InternalServerErrorException(
        'Có lỗi xảy ra khi lấy danh mục theo ID',
      );
    }
  }
  async createCategory(name: string) {
    try {
      const category = await this.prisma.category.create({
        data: { name },
      });

      return {
        status: 'success',
        message: 'Tạo danh mục thành công',
        data: category,
      };
    } catch (error) {
      console.error('[CategoryService][createCategory] Lỗi:', error.message);

      throw new InternalServerErrorException('Có lỗi xảy ra khi tạo danh mục.');
    }
  }

  async updateCategory(id: string, name: string) {
    try {
      const category = await this.prisma.category.update({
        where: { id },
        data: { name },
      });

      return {
        status: 'success',
        message: 'Cập nhật danh mục thành công',
        data: category,
      };
    } catch (error) {
      console.error('Lỗi khi cập nhật danh mục:', error.message);
      throw new InternalServerErrorException(
        'Có lỗi xảy ra khi cập nhật danh mục',
      );
    }
  }

  // Xóa danh mục
  async deleteCategory(id: string) {
    try {
      await this.prisma.category.delete({ where: { id } });

      return {
        status: 'success',
        message: 'Xóa danh mục thành công',
      };
    } catch (error) {
      console.error('Lỗi khi xóa danh mục:', error.message);
      throw new InternalServerErrorException('Có lỗi xảy ra khi xóa danh mục');
    }
  }
}

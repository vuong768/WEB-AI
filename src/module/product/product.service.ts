import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  // Lấy tất cả sản phẩm
  async getAllProducts() {
    try {
      const products = await this.prisma.product.findMany({
        include: { category: true }, // Include thông tin danh mục
      });

      return {
        status: 'success',
        message: 'Lấy danh sách sản phẩm thành công',
        data: products,
      };
    } catch (error) {
      console.error('[ProductService][getAllProducts] Lỗi:', error.message);
      throw new InternalServerErrorException(
        'Không thể lấy danh sách sản phẩm. Vui lòng thử lại sau.',
      );
    }
  }

  // Lấy sản phẩm theo ID
  async getProductById(id: string) {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id },
        include: { category: true }, // Include thông tin danh mục
      });

      if (!product) {
        throw new NotFoundException(`Không tìm thấy sản phẩm với ID "${id}".`);
      }

      return {
        status: 'success',
        message: 'Lấy chi tiết sản phẩm thành công',
        data: product,
      };
    } catch (error) {
      console.error('[ProductService][getProductById] Lỗi:', error.message);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Không thể lấy thông tin sản phẩm. Vui lòng thử lại sau.',
      );
    }
  }

  // Tạo sản phẩm
  async createProduct(data: any) {
    try {
      const product = await this.prisma.product.create({ data });

      return {
        status: 'success',
        message: 'Tạo sản phẩm thành công',
        data: product,
      };
    } catch (error) {
      console.error('[ProductService][createProduct] Lỗi:', error.message);
      throw new InternalServerErrorException(
        'Không thể tạo sản phẩm. Vui lòng thử lại sau.',
      );
    }
  }

  // Cập nhật sản phẩm
  async updateProduct(id: string, data: any) {
    try {
      const existingProduct = await this.prisma.product.findUnique({
        where: { id },
      });

      if (!existingProduct) {
        throw new NotFoundException(
          `Không tìm thấy sản phẩm với ID "${id}" để cập nhật.`,
        );
      }

      const updatedProduct = await this.prisma.product.update({
        where: { id },
        data,
      });

      return {
        status: 'success',
        message: 'Cập nhật sản phẩm thành công',
        data: updatedProduct,
      };
    } catch (error) {
      console.error('[ProductService][updateProduct] Lỗi:', error.message);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Không thể cập nhật sản phẩm. Vui lòng thử lại sau.',
      );
    }
  }

  // Xóa sản phẩm
  async deleteProduct(id: string) {
    try {
      const existingProduct = await this.prisma.product.findUnique({
        where: { id },
      });

      if (!existingProduct) {
        throw new NotFoundException(
          `Không tìm thấy sản phẩm với ID "${id}" để xóa.`,
        );
      }

      await this.prisma.product.delete({ where: { id } });

      return {
        status: 'success',
        message: 'Xóa sản phẩm thành công',
      };
    } catch (error) {
      console.error('[ProductService][deleteProduct] Lỗi:', error.message);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Không thể xóa sản phẩm. Vui lòng thử lại sau.',
      );
    }
  }
}

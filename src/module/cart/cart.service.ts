import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async getCart(userId: string) {
    try {
      const cart = await this.prisma.cart.findUnique({
        where: { userId },
        include: {
          cartItems: {
            include: {
              product: true,
            },
          },
        },
      });

      if (!cart) {
        return {
          status: 'success',
          message: 'Giỏ hàng hiện tại không tồn tại.',
          data: [],
        };
      }

      if (cart.cartItems.length === 0) {
        return {
          status: 'success',
          message: 'Giỏ hàng hiện không có sản phẩm nào.',
          data: [],
        };
      }

      return {
        status: 'success',
        message: 'Lấy giỏ hàng thành công.',
        data: cart.cartItems.map((item) => ({
          product: item.product,
          quantity: item.quantity,
        })),
      };
    } catch (error) {
      console.error('[CartService][getCart] Lỗi:', error.message);
      throw new InternalServerErrorException(
        'Không thể lấy giỏ hàng. Vui lòng thử lại sau.',
      );
    }
  }

  // Thêm sản phẩm vào giỏ hàng
  async addProductToCart(userId: string, productId: string, quantity: number) {
    try {
      // Kiểm tra sản phẩm có tồn tại không
      const product = await this.prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        throw new NotFoundException('Sản phẩm không tồn tại.');
      }

      // Kiểm tra giỏ hàng đã tồn tại chưa
      let cart = await this.prisma.cart.findUnique({ where: { userId } });
      if (!cart) {
        cart = await this.prisma.cart.create({ data: { userId } });
      }

      // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
      const existingCartItem = await this.prisma.cartItem.findFirst({
        where: { cartId: cart.id, productId },
      });

      if (existingCartItem) {
        // Cập nhật số lượng sản phẩm
        const updatedCartItem = await this.prisma.cartItem.update({
          where: { id: existingCartItem.id },
          data: { quantity: existingCartItem.quantity + quantity },
        });

        return {
          status: 'success',
          message: 'Đã cập nhật số lượng sản phẩm trong giỏ hàng.',
          data: updatedCartItem,
        };
      }

      // Thêm sản phẩm mới vào giỏ hàng
      const cartItem = await this.prisma.cartItem.create({
        data: { cartId: cart.id, productId, quantity },
      });

      return {
        status: 'success',
        message: 'Thêm sản phẩm vào giỏ hàng thành công.',
        data: cartItem,
      };
    } catch (error) {
      console.error('[CartService][addProductToCart] Lỗi:', error.message);
      throw new InternalServerErrorException(
        'Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại sau.',
      );
    }
  }

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  async updateProductQuantity(
    userId: string,
    productId: string,
    quantity: number,
  ) {
    try {
      const cart = await this.prisma.cart.findUnique({ where: { userId } });

      if (!cart) {
        throw new NotFoundException('Giỏ hàng không tồn tại.');
      }

      const cartItem = await this.prisma.cartItem.findFirst({
        where: { cartId: cart.id, productId },
      });

      if (!cartItem) {
        throw new NotFoundException('Sản phẩm không có trong giỏ hàng.');
      }

      const updatedCartItem = await this.prisma.cartItem.update({
        where: { id: cartItem.id },
        data: { quantity },
      });

      return {
        status: 'success',
        message: 'Cập nhật số lượng sản phẩm thành công.',
        data: updatedCartItem,
      };
    } catch (error) {
      console.error('[CartService][updateProductQuantity] Lỗi:', error.message);
      throw new InternalServerErrorException(
        'Không thể cập nhật số lượng sản phẩm. Vui lòng thử lại sau.',
      );
    }
  }

  // Xóa sản phẩm khỏi giỏ hàng
  async removeProductFromCart(userId: string, productId: string) {
    try {
      const cart = await this.prisma.cart.findUnique({ where: { userId } });

      if (!cart) {
        throw new NotFoundException('Giỏ hàng không tồn tại.');
      }

      const cartItem = await this.prisma.cartItem.findFirst({
        where: { cartId: cart.id, productId },
      });

      if (!cartItem) {
        throw new NotFoundException('Sản phẩm không có trong giỏ hàng.');
      }

      await this.prisma.cartItem.delete({ where: { id: cartItem.id } });

      return {
        status: 'success',
        message: 'Xóa sản phẩm khỏi giỏ hàng thành công.',
      };
    } catch (error) {
      console.error('[CartService][removeProductFromCart] Lỗi:', error.message);
      throw new InternalServerErrorException(
        'Không thể xóa sản phẩm khỏi giỏ hàng. Vui lòng thử lại sau.',
      );
    }
  }
}

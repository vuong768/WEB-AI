import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}
  async createOrderFromCart(userId: string, orderData: CreateOrderDto) {
    const { shippingAddress, name, phone } = orderData;

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

      if (!cart || cart.cartItems.length === 0) {
        throw new BadRequestException('Giỏ hàng trống. Không thể đặt hàng.');
      }

      let total = 0;
      const orderItems = cart.cartItems.map((cartItem) => {
        total += cartItem.product.price * cartItem.quantity;

        return {
          productId: cartItem.product.id,
          quantity: cartItem.quantity,
        };
      });

      const order = await this.prisma.order.create({
        data: {
          userId,
          total,
          status: 'Đang xử lý',
          shippingAddress,
          name,
          phone,
          orderItems: {
            create: orderItems,
          },
        },
        include: { orderItems: true },
      });

      await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

      return {
        status: 'success',
        message: 'Đặt hàng thành công.',
        data: order,
      };
    } catch (error) {
      console.error('[OrderService][createOrderFromCart] Lỗi:', error.message);
      throw new InternalServerErrorException(
        'Không thể đặt hàng. Vui lòng thử lại sau.',
      );
    }
  }

  // Xem lịch sử đơn hàng
  async getOrderHistory(userId: string) {
    try {
      const orders = await this.prisma.order.findMany({
        where: { userId },
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      if (!orders || orders.length === 0) {
        return {
          status: 'success',
          message: 'Không có đơn hàng nào.',
          data: [],
        };
      }

      return {
        status: 'success',
        message: 'Lấy lịch sử đơn hàng thành công.',
        data: orders,
      };
    } catch (error) {
      console.error('[OrderService][getOrderHistory] Lỗi:', error.message);
      throw new InternalServerErrorException('Không thể lấy lịch sử đơn hàng.');
    }
  }

  // Xem chi tiết đơn hàng
  async getOrderById(orderId: string, userId: string) {
    try {
      const order = await this.prisma.order.findFirst({
        where: { id: orderId, userId },
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
        },
      });

      if (!order) {
        throw new NotFoundException('Không tìm thấy đơn hàng.');
      }

      return {
        status: 'success',
        message: 'Lấy chi tiết đơn hàng thành công.',
        data: order,
      };
    } catch (error) {
      console.error('[OrderService][getOrderById] Lỗi:', error.message);
      throw new InternalServerErrorException(
        'Không thể lấy thông tin đơn hàng.',
      );
    }
  }

  async getAllOrders() {
    try {
      const orders = await this.prisma.order.findMany({
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
          user: true, // Include user details to see who placed the order
        },
        orderBy: { createdAt: 'desc' },
      });

      if (!orders || orders.length === 0) {
        return {
          status: 'success',
          message: 'Không có đơn hàng nào.',
          data: [],
        };
      }

      return {
        status: 'success',
        message: 'Lấy danh sách đơn hàng thành công.',
        data: orders,
      };
    } catch (error) {
      console.error('[OrderService][getAllOrders] Lỗi:', error.message);
      throw new InternalServerErrorException(
        'Không thể lấy danh sách đơn hàng.',
      );
    }
  }

  // Update order status
  async updateOrderStatus(orderId: string, status: string) {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id: orderId },
      });

      if (!order) {
        throw new NotFoundException('Không tìm thấy đơn hàng.');
      }

      const updatedOrder = await this.prisma.order.update({
        where: { id: orderId },
        data: { status },
      });

      return {
        status: 'success',
        message: 'Cập nhật trạng thái đơn hàng thành công.',
        data: updatedOrder,
      };
    } catch (error) {
      console.error('[OrderService][updateOrderStatus] Lỗi:', error.message);
      throw new InternalServerErrorException(
        'Không thể cập nhật trạng thái đơn hàng.',
      );
    }
  }
}

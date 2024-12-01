import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllUsers() {
    try {
      const users = await this.prisma.user.findMany({
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          address: true,
          avatar: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return {
        status: 'success',
        message: 'Lấy danh sách người dùng thành công',
        data: users,
      };
    } catch (error) {
      console.error('Lỗi khi lấy danh sách người dùng:', error.message);
      throw new Error('Không thể lấy danh sách người dùng');
    }
  }

  async deleteUser(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException('Người dùng không tồn tại');
      }

      await this.prisma.user.delete({ where: { id: userId } });

      return {
        status: 'success',
        message: 'Xóa người dùng thành công',
        data: { id: userId },
      };
    } catch (error) {
      console.error('Lỗi khi xóa người dùng:', error.message);
      throw new Error('Không thể xóa người dùng');
    }
  }
}

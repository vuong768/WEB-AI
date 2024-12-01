import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async register(email: string, password: string) {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        throw new BadRequestException('Email đã được đăng ký');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this.prisma.user.create({
        data: { email, password: hashedPassword },
      });

      return {
        status: 'success',
        message: 'Đăng ký tài khoản thành công',
        data: { id: user.id, email: user.email },
      };
    } catch (error) {
      console.error('Lỗi khi đăng ký:', error.message);
      throw new InternalServerErrorException(
        'Có lỗi xảy ra khi đăng ký tài khoản',
      );
    }
  }
  async login(email: string, password: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw new UnauthorizedException('Email không tồn tại');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Mật khẩu không chính xác');
      }

      // Include `role` in the JWT payload
      const token = this.jwtService.sign({
        id: user.id,
        email: user.email,
        role: user.role, // Include role here
      });

      return {
        status: 'success',
        message: 'Đăng nhập thành công',
        data: {
          token, // JWT token
          role: user.role, // User's role
        },
      };
    } catch (error) {
      console.error('Lỗi khi đăng nhập:', error.message);
      throw new UnauthorizedException('Đăng nhập thất bại');
    }
  }

  async getProfile(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          address: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        throw new UnauthorizedException('Người dùng không tồn tại');
      }

      return {
        status: 'success',
        message: 'Lấy thông tin cá nhân thành công',
        data: user,
      };
    } catch (error) {
      console.error('Lỗi khi lấy thông tin cá nhân:', error.message);
      throw new InternalServerErrorException(
        'Có lỗi xảy ra khi lấy thông tin cá nhân',
      );
    }
  }

  async updateProfile(userId: string, updateData: any) {
    try {
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: updateData,
      });

      return {
        status: 'success',
        message: 'Cập nhật thông tin cá nhân thành công',
        data: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          address: user.address,
          avatar: user.avatar,
        },
      };
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin cá nhân:', error.message);
      throw new InternalServerErrorException(
        'Có lỗi xảy ra khi cập nhật thông tin cá nhân',
      );
    }
  }
}

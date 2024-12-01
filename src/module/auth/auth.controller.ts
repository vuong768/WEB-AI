import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RegisterDto, LoginDto, UpdateProfileDto } from './dto/auth.dto';

@ApiTags('Xác thực người dùng')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Đăng ký tài khoản',
    description: 'Tạo tài khoản mới',
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto.email, registerDto.password);
  }

  @Post('login')
  @ApiOperation({ summary: 'Đăng nhập', description: 'Đăng nhập vào hệ thống' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Get('profile')
  @ApiOperation({
    summary: 'Lấy thông tin cá nhân',
    description: 'Yêu cầu token JWT',
  })
  async getProfile(@Req() req: any) {
    return this.authService.getProfile(req.user.id);
  }
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Patch('profile')
  @ApiOperation({
    summary: 'Cập nhật thông tin cá nhân',
    description: 'Cập nhật thông tin tài khoản cá nhân (yêu cầu token JWT)',
  })
  async updateProfile(
    @Req() req: any,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const userId = req.user.id;
    return this.authService.updateProfile(userId, updateProfileDto);
  }
}

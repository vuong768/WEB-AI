import {
  Controller,
  Get,
  Delete,
  Param,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from './user.service';
import { RoleGuard } from '../auth/role.guard';

@ApiTags('Quản lý người dùng (Admin)')
@Controller('admin/users')
@UseGuards(JwtAuthGuard, RoleGuard)
@ApiBearerAuth('access-token')
export class UserController {
  constructor(private readonly adminService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOperation({
    summary: 'Lấy danh sách tất cả người dùng',
    description: 'Chỉ admin mới có quyền truy cập',
  })
  async getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOperation({
    summary: 'Xóa người dùng theo ID',
    description: 'Chỉ admin mới có quyền xóa người dùng',
  })
  async deleteUser(@Param('id') userId: string) {
    return this.adminService.deleteUser(userId);
  }
}

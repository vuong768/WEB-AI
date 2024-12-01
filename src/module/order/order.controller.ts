import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/role.guard';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto';

@ApiTags('Đơn hàng')
@ApiBearerAuth('access-token')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('allorder')
  @ApiOperation({ summary: 'Lấy danh sách tất cả đơn hàng (Admin)' })
  @UseGuards(JwtAuthGuard, RoleGuard)
  async getAllOrders() {
    return this.orderService.getAllOrders();
  }

  @Post()
  @ApiOperation({ summary: 'Đặt hàng từ giỏ hàng' })
  @UseGuards(JwtAuthGuard)
  async createOrderFromCart(
    @Req() req: any,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.orderService.createOrderFromCart(req.user.id, createOrderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Xem lịch sử đơn hàng' })
  @UseGuards(JwtAuthGuard)
  async getOrderHistory(@Req() req: any) {
    return this.orderService.getOrderHistory(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Xem chi tiết đơn hàng' })
  @UseGuards(JwtAuthGuard)
  async getOrderById(@Req() req: any, @Param('id') id: string) {
    return this.orderService.getOrderById(id, req.user.id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Cập nhật trạng thái đơn hàng (Admin)' })
  @UseGuards(JwtAuthGuard, RoleGuard)
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateOrderStatusDto,
  ) {
    return this.orderService.updateOrderStatus(id, updateStatusDto.status);
  }
}

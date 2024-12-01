import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AddToCartDto, UpdateCartDto } from './dto/cart.dto';

@ApiTags('Giỏ hàng')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách sản phẩm trong giỏ hàng' })
  async getCart(@Req() req: any) {
    return this.cartService.getCart(req.user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Thêm sản phẩm vào giỏ hàng' })
  async addProductToCart(@Req() req: any, @Body() addToCartDto: AddToCartDto) {
    const { productId, quantity } = addToCartDto;
    return this.cartService.addProductToCart(req.user.id, productId, quantity);
  }

  @Patch()
  @ApiOperation({ summary: 'Cập nhật số lượng sản phẩm trong giỏ hàng' })
  async updateProductQuantity(
    @Req() req: any,
    @Body() updateCartDto: UpdateCartDto,
  ) {
    const { productId, quantity } = updateCartDto;
    return this.cartService.updateProductQuantity(
      req.user.id,
      productId,
      quantity,
    );
  }

  @Delete(':productId')
  @ApiOperation({ summary: 'Xóa sản phẩm khỏi giỏ hàng' })
  async removeProductFromCart(
    @Req() req: any,
    @Param('productId') productId: string,
  ) {
    return this.cartService.removeProductFromCart(req.user.id, productId);
  }
}

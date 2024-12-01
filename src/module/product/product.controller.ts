import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/role.guard';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@ApiTags('Sản phẩm')
@ApiBearerAuth('access-token')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách sản phẩm' })
  async getAllProducts() {
    return this.productService.getAllProducts();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy sản phẩm theo ID' })
  async getProductById(@Param('id') id: string) {
    return this.productService.getProductById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOperation({ summary: 'Tạo sản phẩm (Admin)' })
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productService.createProduct(createProductDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOperation({ summary: 'Cập nhật sản phẩm (Admin)' })
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.updateProduct(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOperation({ summary: 'Xóa sản phẩm (Admin)' })
  async deleteProduct(@Param('id') id: string) {
    return this.productService.deleteProduct(id);
  }
}

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
import { CategoryService } from './category.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/role.guard';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

@ApiTags('Danh mục')
@ApiBearerAuth('access-token')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // Lấy tất cả danh mục - không cần kiểm tra vai trò
  @Get()
  @ApiOperation({ summary: 'Lấy tất cả danh mục' })
  async getAllCategories() {
    return this.categoryService.getAllCategories();
  }

  // Lấy danh mục theo ID - không cần kiểm tra vai trò
  @Get(':id')
  @ApiOperation({ summary: 'Lấy danh mục theo ID' })
  async getCategoryById(@Param('id') id: string) {
    return this.categoryService.getCategoryById(id);
  }

  // Tạo danh mục - yêu cầu vai trò admin
  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOperation({ summary: 'Tạo danh mục (Admin)' })
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.createCategory(createCategoryDto.name);
  }

  // Cập nhật danh mục - yêu cầu vai trò admin
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOperation({ summary: 'Cập nhật danh mục (Admin)' })
  async updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.updateCategory(id, updateCategoryDto.name);
  }

  // Xóa danh mục - yêu cầu vai trò admin
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOperation({ summary: 'Xóa danh mục (Admin)' })
  async deleteCategory(@Param('id') id: string) {
    return this.categoryService.deleteCategory(id);
  }
}

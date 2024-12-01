import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsUrl,
  MinLength,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    example: 'iPhone 14',
    description: 'Tên sản phẩm cần tạo',
  })
  @IsString()
  @MinLength(3, { message: 'Tên sản phẩm phải có ít nhất 3 ký tự' })
  name: string;

  @ApiProperty({
    example: 'Điện thoại thông minh thế hệ mới',
    description: 'Mô tả sản phẩm',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 25000000,
    description: 'Giá sản phẩm',
  })
  @IsNumber()
  @Min(0, { message: 'Giá sản phẩm phải lớn hơn hoặc bằng 0' })
  price: number;

  @ApiProperty({
    example: 100,
    description: 'Số lượng tồn kho',
  })
  @IsNumber()
  @Min(0, { message: 'Số lượng tồn kho phải lớn hơn hoặc bằng 0' })
  stock: number;

  @ApiProperty({
    example: 'https://example.com/image.jpg',
    description: 'URL hình ảnh sản phẩm',
  })
  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({
    example: '63f8f1c4b75b47c2c54e7e77',
    description: 'ID danh mục của sản phẩm',
  })
  @IsString()
  @IsOptional()
  categoryId?: string;
}

export class UpdateProductDto {
  @ApiProperty({
    example: 'iPhone 14 Pro Max',
    description: 'Tên sản phẩm cần cập nhật',
  })
  @IsString()
  @IsOptional()
  @MinLength(3, { message: 'Tên sản phẩm phải có ít nhất 3 ký tự' })
  name?: string;

  @ApiProperty({
    example: 'Phiên bản Pro Max với màn hình lớn hơn',
    description: 'Mô tả sản phẩm cần cập nhật',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 30000000,
    description: 'Giá sản phẩm cần cập nhật',
  })
  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'Giá sản phẩm phải lớn hơn hoặc bằng 0' })
  price?: number;

  @ApiProperty({
    example: 50,
    description: 'Số lượng tồn kho cần cập nhật',
  })
  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'Số lượng tồn kho phải lớn hơn hoặc bằng 0' })
  stock?: number;

  @ApiProperty({
    example: 'https://example.com/new-image.jpg',
    description: 'URL hình ảnh sản phẩm cần cập nhật',
  })
  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({
    example: '63f8f1c4b75b47c2c54e7e77',
    description: 'ID danh mục mới của sản phẩm',
  })
  @IsString()
  @IsOptional()
  categoryId?: string;
}

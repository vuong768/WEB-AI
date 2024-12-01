import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUrl, MinLength } from 'class-validator';

export class CreateBlogDto {
  @ApiProperty({
    example: 'Cách sử dụng Prisma với NestJS',
    description: 'Tiêu đề blog cần tạo',
  })
  @IsString()
  @MinLength(5, { message: 'Tiêu đề blog phải có ít nhất 5 ký tự' })
  title: string;

  @ApiProperty({
    example: 'Hướng dẫn chi tiết cách tích hợp Prisma với NestJS...',
    description: 'Nội dung của blog',
  })
  @IsString()
  @MinLength(10, { message: 'Nội dung blog phải có ít nhất 10 ký tự' })
  content: string;

  @ApiProperty({
    example: 'https://example.com/blog-image.jpg',
    description: 'URL ảnh đại diện blog',
  })
  @IsUrl()
  @IsOptional()
  imageUrl?: string;
}

export class UpdateBlogDto {
  @ApiProperty({
    example: 'Cách sử dụng Prisma nâng cao',
    description: 'Tiêu đề blog cần cập nhật',
  })
  @IsString()
  @IsOptional()
  @MinLength(5, { message: 'Tiêu đề blog phải có ít nhất 5 ký tự' })
  title?: string;

  @ApiProperty({
    example: 'Nội dung chi tiết hơn về Prisma...',
    description: 'Nội dung blog cần cập nhật',
  })
  @IsString()
  @IsOptional()
  @MinLength(10, { message: 'Nội dung blog phải có ít nhất 10 ký tự' })
  content?: string;

  @ApiProperty({
    example: 'https://example.com/new-blog-image.jpg',
    description: 'URL ảnh đại diện blog cần cập nhật',
  })
  @IsUrl()
  @IsOptional()
  imageUrl?: string;
}

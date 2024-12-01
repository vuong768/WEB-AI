import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Điện tử',
    description: 'Tên danh mục cần tạo',
  })
  @IsString()
  @MinLength(3, { message: 'Tên danh mục phải có ít nhất 3 ký tự' })
  name: string;
}

export class UpdateCategoryDto {
  @ApiProperty({
    example: 'Điện tử cao cấp',
    description: 'Tên danh mục cần cập nhật',
  })
  @IsString()
  @MinLength(3, { message: 'Tên danh mục phải có ít nhất 3 ký tự' })
  name: string;
}

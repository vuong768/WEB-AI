import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsUrl,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email của người dùng',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Mật khẩu của người dùng, tối thiểu 6 ký tự',
  })
  @IsString()
  @MinLength(6)
  password: string;
}

export class LoginDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email của người dùng',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Mật khẩu của người dùng',
  })
  @IsString()
  password: string;
}

export class UpdateProfileDto {
  @ApiProperty({
    example: 'Nguyễn Văn A',
    description: 'Họ của người dùng',
    required: false,
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({
    example: 'Nguyễn',
    description: 'Tên của người dùng',
    required: false,
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({
    example: '0123456789',
    description: 'Số điện thoại của người dùng',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    example: '123 Đường ABC, Quận 1, TP.HCM',
    description: 'Địa chỉ của người dùng',
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    description: 'URL ảnh đại diện',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  avatar?: string;
}

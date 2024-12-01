import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    example: 'Nguyễn Văn A',
    description: 'Tên người nhận hàng',
  })
  @IsString()
  @IsNotEmpty({ message: 'Tên người nhận hàng không được để trống' })
  name: string;

  @ApiProperty({
    example: '0123456789',
    description: 'Số điện thoại người nhận hàng',
  })
  @IsPhoneNumber('VN', { message: 'Số điện thoại không hợp lệ' })
  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  phone: string;

  @ApiProperty({
    example: '123 Đường ABC, Quận 1, TP.HCM',
    description: 'Địa chỉ giao hàng',
  })
  @IsString()
  @IsNotEmpty({ message: 'Địa chỉ giao hàng không được để trống' })
  shippingAddress: string;
}

export class UpdateOrderStatusDto {
  @ApiProperty({
    example: 'Đã giao hàng',
    description: 'Trạng thái mới của đơn hàng',
  })
  @IsString()
  @IsNotEmpty({ message: 'Trạng thái đơn hàng không được để trống' })
  status: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, Min } from 'class-validator';

export class AddToCartDto {
  @ApiProperty({
    example: 'productId123',
    description: 'ID của sản phẩm cần thêm vào giỏ hàng',
  })
  @IsString({ message: 'ID sản phẩm phải là chuỗi' })
  productId: string;

  @ApiProperty({
    example: 2,
    description: 'Số lượng sản phẩm cần thêm vào giỏ hàng',
  })
  @IsNumber({}, { message: 'Số lượng phải là một số' })
  @Min(1, { message: 'Số lượng phải ít nhất là 1' })
  quantity: number;
}

export class UpdateCartDto {
  @ApiProperty({
    example: 'productId123',
    description: 'ID của sản phẩm cần cập nhật số lượng',
  })
  @IsString({ message: 'ID sản phẩm phải là chuỗi' })
  productId: string;

  @ApiProperty({
    example: 5,
    description: 'Số lượng mới của sản phẩm trong giỏ hàng',
  })
  @IsNumber({}, { message: 'Số lượng phải là một số' })
  @Min(1, { message: 'Số lượng phải ít nhất là 1' })
  quantity: number;
}

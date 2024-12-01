import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Đặt module là Global để dùng ở bất kỳ đâu
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}

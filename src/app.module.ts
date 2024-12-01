import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './module/auth/auth.module';
import { ProductModule } from './module/product/product.module';
import { CartModule } from './module/cart/cart.module';
import { CategoryModule } from './module/category/category.module';
import { OrderModule } from './module/order/order.module';
import { BlogModule } from './module/blog/blog.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './module/user/user.module';

@Module({
  imports: [AuthModule, ProductModule, CartModule, CategoryModule, OrderModule, BlogModule, PrismaModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

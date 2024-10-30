// src/product/product.module.ts
import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product1MonthsController, Product12MonthsController } from './product.controller'; // Updated controllers
import { PrismaModule } from '../utills/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [Product1MonthsController, Product12MonthsController], // Updated controller names
  providers: [ProductService],
})
export class ProductModule {}

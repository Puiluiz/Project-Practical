// src/product/product.controller.ts
import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProduct1MonthsDto } from './dto/create-product1months.dto';
import { CreateProduct12MonthsDto } from './dto/create-product12months.dto';
import { Product1months, Product12months } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Product1month')
// Controller สำหรับ Product1Months
@Controller('products/1month')
export class Product1MonthsController {
  constructor(private readonly productService: ProductService) {}

  @Post('buy/:userId/:productId')
  async buyProduct1Month(@Param('userId') userId: string, @Param('productId') productId: string)  {
    return this.productService.buyProduct1Months(Number(userId), Number(productId));
  }

  @Post()
  async create(@Body() productData: CreateProduct1MonthsDto): Promise<Product1months> {
    return this.productService.createProduct1Months(productData);
  }

  @Get()
  async findAll(): Promise<Product1months[]> {
    return this.productService.findAllProducts1Months();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product1months | null> {
    return this.productService.findOneProduct1Months(Number(id));
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() productData: Partial<CreateProduct1MonthsDto>): Promise<Product1months> {
    return this.productService.updateProduct1Months(Number(id), productData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Product1months> {
    return this.productService.removeProduct1Months(Number(id));
  }
}

@ApiTags('Product12months')
// Controller สำหรับ Product12Months
@Controller('products/12months')
export class Product12MonthsController {
  constructor(private readonly productService: ProductService) {}

  @Post('buy/:userId/:productId')
  async buyProduct12Month(@Param('userId') userId: string, @Param('productId') productId: string) {
    return this.productService.buyProduct12Months(Number(userId), Number(productId));
  }

  @Post()
  async create(@Body() productData: CreateProduct12MonthsDto): Promise<Product12months> {
    return this.productService.createProduct12Months(productData);
  }

  @Get()
  async findAll(): Promise<Product12months[]> {
    return this.productService.findAllProducts12Months();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product12months | null> {
    return this.productService.findOneProduct12Months(Number(id));
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() productData: Partial<CreateProduct12MonthsDto>): Promise<Product12months> {
    return this.productService.updateProduct12Months(Number(id), productData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Product12months> {
    return this.productService.removeProduct12Months(Number(id));
  }
}

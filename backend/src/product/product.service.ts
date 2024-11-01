// src/product/product.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../utills/prisma/prisma.service';
import { Product1months, Product12months } from '@prisma/client';
import { CreateProduct1MonthsDto } from './dto/create-product1months.dto';
import { CreateProduct12MonthsDto } from './dto/create-product12months.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  // Product1Months
  async createProduct1Months(data: CreateProduct1MonthsDto): Promise<Product1months> {
    return this.prisma.product1months.create({
      data: {
        email: data.email,
        password: data.password,
        price: parseFloat(data.price.toString()),
        expire: new Date(data.expire),
      },
    });
  }

  async findAllProducts1Months(): Promise<Product1months[]> {
    return this.prisma.product1months.findMany();
  }

  async findOneProduct1Months(id: number): Promise<Product1months | null> {
    return this.prisma.product1months.findUnique({ where: { id } });
  }

  async updateProduct1Months(id: number, data: Partial<CreateProduct1MonthsDto>): Promise<Product1months> {
    return this.prisma.product1months.update({
      where: { id },
      data: {
        email: data.email,
        password: data.password,
        price: data.price,
        expire: data.expire ? new Date(data.expire) : undefined,
        quantity: 1,
        updatedAt: new Date(),
      },
    });
  }

  async removeProduct1Months(id: number): Promise<Product1months> {
    return this.prisma.product1months.delete({ where: { id } });
  }

  async buyProduct1Months(userId: number, productId: number): Promise<{ message: string }> {
    const product = await this.prisma.product1months.findUnique({ where: { id: productId } });
    if (!product) throw new Error('Product not found');

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');
    if (user.balance < product.price) throw new Error('Insufficient balance');

    await this.prisma.user.update({
      where: { id: userId },
      data: { balance: { decrement: product.price } },
    });

    await this.prisma.product1months.delete({ where: { id: productId } });

    await this.prisma.historyProduct.create({
      data: {
        user: { connect: { id: userId } },
        productId,
        productName: '1 Month Product',
        amount: product.price,
        email: product.email,
        password: product.password,
        status: new Date(product.expire),
      },
    });

    return { message: 'Product purchased successfully' };
  }

  // Product12Months
  async createProduct12Months(data: CreateProduct12MonthsDto): Promise<Product12months> {
    return this.prisma.product12months.create({
      data: {
        email: data.email,
        password: data.password,
        price: parseFloat(data.price.toString()),
        expire: new Date(data.expire),
        quantity: 0,
      },
    });
  }

  async findAllProducts12Months(): Promise<Product12months[]> {
    return this.prisma.product12months.findMany();
  }

  async findOneProduct12Months(id: number): Promise<Product12months | null> {
    return this.prisma.product12months.findUnique({ where: { id } });
  }

  async updateProduct12Months(id: number, data: Partial<CreateProduct12MonthsDto>): Promise<Product12months> {
    return this.prisma.product12months.update({
      where: { id },
      data: {
        email: data.email,
        password: data.password,
        price: data.price,
        expire: data.expire ? new Date(data.expire) : undefined, // Convert expire to Date if needed
        quantity: 1,
        updatedAt: new Date(),
      },
    });
  }
  

  async removeProduct12Months(id: number): Promise<Product12months> {
    return this.prisma.product12months.delete({ where: { id } });
  }

  async buyProduct12Months(userId: number, productId: number): Promise<{ message: string }> {
    const product = await this.prisma.product12months.findUnique({ where: { id: productId } });
    if (!product) throw new Error('Product not found');

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.balance < product.price) throw new Error('Insufficient balance');

    await this.prisma.user.update({
      where: { id: userId },
      data: { balance: { decrement: product.price } },
    });

    await this.prisma.product12months.delete({ where: { id: productId } });

    await this.prisma.historyProduct.create({
      data: {
        user: { connect: { id: userId } },
        productId,
        productName: 'Purchased 12 Month Product',
        amount: product.price,
        email: product.email,
        password: product.password,
        status: new Date(),
      },
    });

    return { message: 'Product purchased successfully' };
  }
}

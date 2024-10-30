// src/prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  history: any;
  async onModuleInit() {
    await this.$connect(); // เชื่อมต่อกับฐานข้อมูล
  }

  async onModuleDestroy() {
    await this.$disconnect(); // ปิดการเชื่อมต่อฐานข้อมูล
  }
}

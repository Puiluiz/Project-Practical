import { Module } from '@nestjs/common';
import { SummaryController } from '../summary/summary.controller';
import { SummaryService } from '../summary/summary.service';
import { PrismaService } from '../utills/prisma/prisma.service';

@Module({
  imports: [],
  controllers: [SummaryController],  // เพิ่ม SummaryController
  providers: [SummaryService, PrismaService],  // เพิ่ม SummaryService และ PrismaService
})
export class SummaryModule {}

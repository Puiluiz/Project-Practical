import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { HistoryService } from './history.service';
import { ApiTags } from '@nestjs/swagger';
import { HistoryProduct } from '@prisma/client';

@ApiTags('History')
@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  // ดึงข้อมูลประวัติของผู้ใช้ตาม userId
  @Get('products/:userId')
  async getHistory(@Param('userId') userId: string) {
    const userIdNumber = Number(userId); // แปลง userId จาก string เป็น number
    if (isNaN(userIdNumber)) {
      throw new Error('Invalid userId'); // ตรวจสอบว่า userId เป็นตัวเลข
    }
    return this.historyService.findAllByUserId(userIdNumber);
  }

  // ดึงข้อมูลประวัติการเติมเงินของผู้ใช้ตาม userId
  @Get('topup/:userId')
  async getTopupHistory(@Param('userId') userId: string) {
    const userIdNumber = Number(userId); // แปลง userId จาก string เป็น number
    if (isNaN(userIdNumber)) {
      throw new Error('Invalid userId'); // ตรวจสอบว่า userId เป็นตัวเลข
    }
    return this.historyService.findTopupHistoryByUserId(userIdNumber);
  }

  // ดึงข้อมูลประวัติสินค้าของผู้ใช้ทุกคน
  @Get('products')
  async getAllHistory(@Query() q: { q: string }): Promise<HistoryProduct[]> {
    return this.historyService.findAll(q);
  }

  // ดึงข้อมูลประวัติการเติมเงินของผู้ใช้ทุกคน
  @Get('topup')
  async getAllTopupHistory(@Query() q: { q: string }) {
    return this.historyService.findAllTopup(q);
  }
}

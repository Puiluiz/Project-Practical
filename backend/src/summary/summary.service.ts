import { Injectable } from '@nestjs/common';
import { PrismaService } from '../utills/prisma/prisma.service';

@Injectable()
export class SummaryService {
  constructor(private readonly prisma: PrismaService) {}

  // สรุปยอดข้อมูล
  async getSummary() {
    const totalSales = await this.prisma.historyProduct.findMany();
    let totalSalesAmount = 0;

    for (const element of totalSales) {
      console.log(element.amount);
      totalSalesAmount += element.amount;
    }

    const currentDate = new Date();
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    );
    const lastDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
    );

    const monthlySales = await this.prisma.historyProduct.aggregate({
      _sum: {
        amount: true, // กรองเฉพาะยอดขายในเดือนปัจจุบัน
      },
      where: {
        createdAt: {
          gte: firstDayOfMonth,
          lte: lastDayOfMonth,
        },
      },
    });

    // ดึงจำนวนผู้ใช้งานทั้งหมด
    const totalUsers = await this.prisma.user.count();

    // ส่งข้อมูลกลับ
    return {
      totalSales: totalSalesAmount || 0,
      monthlySales: monthlySales._sum.amount || 0,
      totalUsers,
    };
  }
}

// import { Injectable } from '@nestjs/common';
// import { PrismaService } from '../utills/prisma/prisma.service';

// @Injectable()
// export class SummaryService {
//   constructor(private readonly prisma: PrismaService) {}

//   // สรุปยอดข้อมูล
//   async getSummary() {
//     const totalSales = await this.prisma.historyProduct.findMany();
//     let totalSalesAmount = 0;

//     for (const element of totalSales) {
//       console.log(element.amount);
//       totalSalesAmount += element.amount;
//     }

//     const currentDate = new Date();
//     const firstDayOfMonth = new Date(
//       currentDate.getFullYear(),
//       currentDate.getMonth(),
//       1,
//     );
//     const lastDayOfMonth = new Date(
//       currentDate.getFullYear(),
//       currentDate.getMonth() + 1,
//       0,
//     );

//     const monthlySales = await this.prisma.historyProduct.aggregate({
//       _sum: {
//         amount: true, // กรองเฉพาะยอดขายในเดือนปัจจุบัน
//       },
//       where: {
//         createdAt: {
//           gte: firstDayOfMonth,
//           lte: lastDayOfMonth,
//         },
//       },
//     });

//     // ดึงจำนวนผู้ใช้งานทั้งหมด
//     const totalUsers = await this.prisma.user.count();

//     // ส่งข้อมูลกลับ
//     return {
//       totalSales: totalSalesAmount || 0,
//       monthlySales: monthlySales._sum.amount || 0,
//       totalUsers,
//     };
//   }
// }
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../utills/prisma/prisma.service';

@Injectable()
export class SummaryService {
  constructor(private readonly prisma: PrismaService) {}

  // สรุปยอดข้อมูล
  async getSummary() {
    // Calculate total sales
    const totalSalesData = await this.prisma.historyProduct.findMany({
      select: { amount: true },
    });
    const totalSalesAmount = totalSalesData.reduce((sum, element) => sum + element.amount, 0);

    // Get the current month's first and last day
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    // Calculate monthly sales
    const monthlySalesData = await this.prisma.historyProduct.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        createdAt: {
          gte: firstDayOfMonth,
          lte: lastDayOfMonth,
        },
      },
    });

    // Get total user count
    const totalUsers = await this.prisma.user.count();

    // Return the summary data
    return {
      totalSales: totalSalesAmount || 0,
      monthlySales: monthlySalesData._sum.amount || 0,
      totalUsers,
    };
  }
}

// Come from Perplexity AI (https://perplexity.ai) - 100% pure
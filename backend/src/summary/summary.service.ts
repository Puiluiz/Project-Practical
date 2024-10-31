import { Injectable } from '@nestjs/common';
import { PrismaService } from '../utills/prisma/prisma.service';

@Injectable()
export class SummaryService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary() {
    try {
      // Step 1: Calculate all-time total sales amount.
      const totalSales = await this.prisma.historyProduct.findMany();
      const totalSalesAmount = totalSales.reduce((sum, product) => sum + product.amount, 0);
  
      // Step 2: Set up the date range for the current month.
      const currentDate = new Date();
      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59);
  
      console.log('First day of month:', firstDayOfMonth);
      console.log('Last day of month:', lastDayOfMonth);
  
      // Step 3: Calculate monthly sales amount.
      const monthlySales = await this.prisma.historyProduct.aggregate({
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
  
      console.log('Monthly sales result:', monthlySales);
  
      // Step 4: Get total users.
      const totalUsers = await this.prisma.user.count();
  
      // Return summary.
      return {
        totalSales: totalSalesAmount || 0,
        monthlySales: monthlySales._sum.amount || 0,
        totalUsers,
      };
    } catch (error) {
      console.error('Error in getSummary:', error);
      throw new Error('Failed to fetch sales summary.');
    }
  }
  
}

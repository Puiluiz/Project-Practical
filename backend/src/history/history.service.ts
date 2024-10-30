import { Injectable } from '@nestjs/common';
import { HistoryProduct } from '@prisma/client';
import { PrismaService } from 'src/utills/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class HistoryService {
  constructor(private prisma: PrismaService) {}

  // ฟังก์ชันสำหรับดึงประวัติทั้งหมดของผู้ใช้
  async findAllByUserId(userId: number) {
    return this.prisma.historyProduct.findMany({
      where: {
        userId, // ตรวจสอบให้แน่ใจว่า userId เป็นประเภท number
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // ฟังก์ชันสำหรับดึงประวัติการเติมเงินทั้งหมดของผู้ใช้
  async findTopupHistoryByUserId(userId: number) {
    return this.prisma.historytopup.findMany({
      where: {
        userId, // ตรวจสอบให้แน่ใจว่า userId เป็นประเภท number
      },
      orderBy: {
        createdAt: 'desc', // เรียงตามวันที่ล่าสุด
      },
    });
  }

  //   // ดึงข้อมูลผู้ใช้ทั้งหมด
  // async findAllUsers(q: { q: string }): Promise<User[]> {
  //   return this.prisma.user.findMany({
  //     where: {
  //       OR: [
  //         !isNaN(Number(q.q)) ? { id: Number(q.q) } : undefined,
  //         { username: { contains: q.q || '' } },
  //         { email: { contains: q.q || '' } },
  //       ].filter(Boolean),  // This removes any undefined values from the OR array
  //     },
  //     orderBy : {id: "asc"}
  //   });
  // }

  // ฟังก์ชันสำหรับดึงประวัติสินค้าของผู้ใช้ทุกคน
  async findAll(q?: { q?: string }): Promise<HistoryProduct[]> {
    console.log('Received query:', q); // Log the incoming query

    try {
      if (!q || !q.q) {
        return this.prisma.historyProduct.findMany({
          orderBy: { id: 'asc' },
        });
      }

      // Create search conditions based on the query
      const searchConditions = [
        !isNaN(Number(q.q)) ? { userId: Number(q.q) } : undefined, // Search by user ID as exact number match
      ].filter(Boolean) as Prisma.HistoryProductWhereInput[];

      // Log search conditions to debug
      console.log('Search conditions:', searchConditions);

      // Find products based on the constructed search conditions
      const result = await this.prisma.historyProduct.findMany({
        where: { OR: searchConditions },
        orderBy: { id: 'asc' },
      });

      console.log('Search result:', result); // Log the search result
      return result;
    } catch (error) {
      console.error('Error retrieving products:', error);
      throw new Error('Failed to retrieve products');
    }
  }

  // ฟังก์ชันสำหรับดึงประวัติการเติมเงินของผู้ใช้ทุกคน
  async findAllTopup(q?: { q?: string }) {
    console.log('Received query:', q); // Log the incoming query

    try {
      // If no query is provided, return all records from historytopup
      if (!q || !q.q) {
        console.log('No search query provided, fetching all records.');
        return this.prisma.historytopup.findMany({
          orderBy: { id: 'asc' },
        });
      }

      // Search for records where userId matches the provided query
      const userId = Number(q.q);
      const result = await this.prisma.historytopup.findMany({
        where: { userId: userId },
        orderBy: { id: 'asc' },
      });

      console.log('Search result:', result); // Log the search result
      return result;
    } catch (error) {
      console.error('Error retrieving products:', error);
      throw new Error('Failed to retrieve products');
    }
  }
}

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/utills/prisma/prisma.service';
import { ManybahtService } from '../manybaht/manybaht.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdatePasswordAdminDto } from './dto/update-password-admin.dto';
import { User, UserRole } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private manybahtService: ManybahtService,
  ) {}

  // เพิ่มยอดเงินให้ผู้ใช้

  async addBalance(userId: number, amount: number): Promise<User> {
    // Update the user's balance by incrementing it
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    // Check if the user exists
    if (!user) {
      throw new Error('User not found');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        balance: {
          increment: amount,
        },
      },
    });

    // Optionally log the top-up history
    const transactionId = await this.prisma.historytopup.count(); // Get the current count to use as a transaction ID

    console.log(this.prisma.historytopup.findMany); // ในการดึง topup ไปทำ stat

    await this.prisma.historytopup.create({
      data: {
        userId: userId,
        transactionId: transactionId + 1, // Increment the count for a new transaction ID
        transactionName: `เติม coin สำเร็จ`,
        amount: amount,
      },
    });

    return updatedUser;
  }

  // ซื้อสินค้า
  async buyProduct(
    userId: number,
    productId: number,
    productType: '1month' | '12month',
  ) {
    let product;
    if (productType === '1month') {
      product = await this.prisma.product1months.findUnique({
        where: { id: productId },
      });
    } else {
      product = await this.prisma.product12months.findUnique({
        where: { id: productId },
      });
    }

    if (!product) {
      throw new Error('Product not found');
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user || user.balance < product.price) {
      throw new Error('Insufficient balance');
    }

    // หัก balance ของผู้ใช้
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        balance: {
          decrement: product.price,
        },
      },
    });

    // ลบ Product ที่ซื้อออกจากตาราง Product
    console.log('Product type:', productType);

    // บันทึกประวัติการซื้อสินค้าใน HistoryProduct
    await this.prisma.historyProduct.create({
      data: {
        user: { connect: { id: userId } },
        productId: product.productId,
        productName:
          productType === '1month' ? '1 Month Product' : '12 Month Product',
        amount: product.price,
        email: product.email,
        password: product.password,
        status: new Date(),
        // product1monthId: productType === '1month' ? productId : null,  // กำหนดค่าถ้าเป็น 1 เดือน
        // product12monthId: productType === '12month' ? productId : null, // กำหนดค่าถ้าเป็น 12 เดือน
      },
    });

    return { message: 'Product purchased successfully', product };
  }

  // ดึงข้อมูลผู้ใช้ตาม ID
  async getProfile(userId: number) {
    console.log(
      this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          username: true,
          balance: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
    );
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        balance: true,
        role: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  // ดึงข้อมูลผู้ใช้ทั้งหมด
  async findAllUsers(q: { q: string }): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        OR: [
          !isNaN(Number(q.q)) ? { id: Number(q.q) } : undefined,
          { username: { contains: q.q || '' } },
          { email: { contains: q.q || '' } },
        ].filter(Boolean), // This removes any undefined values from the OR array
      },
      orderBy: { id: 'asc' },
    });
  }

  // ดึงข้อมูลผู้ใช้ตาม ID
  async findOneUser(userId: number): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return user;
  }

  // ลบผู้ใช้
  async removeUser(userId: number): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Delete related records in the Historytopup table first
    await this.prisma.historytopup.deleteMany({
      where: { userId: userId },
    });

    // Now delete the user
    return this.prisma.user.delete({ where: { id: userId } });
  }

  // Update user information
  async updateUser(
    userId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<User | null> {
    // Fetch the user from the database
    const existingUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Update the user with provided data
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        // Update only fields that are provided in updateUserDto
        email: updateUserDto.email || existingUser.email, // Keep the current email if not provided
        balance:
          updateUserDto.balance !== undefined // Check if balance is provided
            ? typeof updateUserDto.balance === 'string'
              ? parseFloat(updateUserDto.balance) // Parse string to number if balance is a string
              : updateUserDto.balance // Use balance as number if already a number
            : existingUser.balance, // Keep the current balance if not provided
        role: updateUserDto.role || existingUser.role, // Keep the current role if not provided
      },
    });

    return updatedUser;
  }

  // อัปเดตข้อมูลผู้ใช้
  // async updateUser(userId: number, updateUserDto: UpdateUserDto): Promise<User | null> {
  //   const updatedUser = await this.prisma.user.update({
  //     where: { id: userId },
  //     data: {
  //       ...updateUserDto,
  //       balance:
  //         typeof updateUserDto.balance === 'string'
  //           ? parseFloat(updateUserDto.balance)
  //           : updateUserDto.balance,
  //       role: updateUserDto.role as UserRole,
  //     },
  //   });
  //   return updatedUser;
  // }

  // ดึงข้อมูลผู้ใช้พร้อมประวัติ
  async getUserWithHistory(userId: number) {
    return await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        products: true, // Includes HistoryProduct
        topups: true, // Includes Historytopup
      },
    });
  }

  async updatePassword(
    userId: number,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<{ message: string }> {
    // Fetch user from the database
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const { oldPassword, newPassword } = updatePasswordDto;

    // Directly compare old password with the stored plain text password
    if (user.password !== oldPassword) {
      throw new BadRequestException('Old password is incorrect');
    }
    // Update user's password without hashing (store plain text)
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: newPassword }, // Store the new password as plain text
    });

    // Return a message instead of User data
    return { message: 'Password updated successfully' };
  }

  async updatePasswordAdmin(
    userId: number,
    UpdatePasswordAdminDto: UpdatePasswordAdminDto,
  ): Promise<{ message: string }> {
    // Fetch user from the database
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const { password } = UpdatePasswordAdminDto;

    console.log(password)
    // Update user's password without hashing (store plain text)
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: password }, // Store the new password as plain text
    });

    // Return a message instead of User data
    return { message: 'Password updated successfully' };
  }
}

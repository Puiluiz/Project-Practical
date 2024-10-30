import { Controller, Get, Post, Put, Delete, Param, Body, HttpException, HttpStatus, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { ManybahtService } from '../manybaht/manybaht.service';
import { CreatePaymentDto } from './dto/create-payment.dto'; 
import { User } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly manybahtService: ManybahtService,
  ) {}

  //เพิ่มยอดเงินให้ผู้ใช้
  // @Post(':id/add-balance/hee')
  // async addBalance(@Param('id') userId: number, @Body() hash: {hash: string}) {
  //   try {
  //     const user = await this.userService.addBalance(userId, hash);
  //     return {
  //       message: 'ยอดเงินเพิ่มสำเร็จ',
  //       user,
  //     };
  //   } catch (error) {
  //     throw new HttpException(
  //       { message: 'เกิดข้อผิดพลาดในการเพิ่มยอดเงิน', error: error.message },
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  // }

  // รับ hash และ addbalance Manybaht
  // @Post('manybaht/initiate')
  // async initiatePayment(@Body() createPaymentDto: CreatePaymentDto) {
  //   try {
  //     const { hash } = createPaymentDto;
  //     return await this.manybahtService.initiatePayment(hash);
  //   } catch (error) {
  //     throw new HttpException('การเริ่มต้นการชำระเงินล้มเหลว', HttpStatus.BAD_REQUEST);
  //   }
  // }

  // รับ hash และ addbalance Manybaht
  // @Post('manybaht/initiate')
  // async initiatePayment(@Body() createPaymentDto: CreatePaymentDto) {
  //   try {
  //     const { hash } = createPaymentDto;
  //     return await this.manybahtService.initiatePayment(hash);
  //   } catch (error) {
  //     throw new HttpException('การเริ่มต้นการชำระเงินล้มเหลว', HttpStatus.BAD_REQUEST);
  //   }
  // }
  

  @Post('manybaht/initiate')
  async initiatePayment(@Body() createPaymentDto: CreatePaymentDto) {
    // try {
      const { hash, userID } = createPaymentDto;

      // Step 1: Initiate the payment process with the hash
      const amount = await this.manybahtService.initiatePayment(hash);

      // Step 2: Update the user's balance
      const updatedUser = await this.userService.addBalance(userID, amount);

      // Step 3: Return a response with the updated user and their balance
      return {
        message: 'Payment successful and balance updated',
        user: updatedUser,
        amount: amount
      };
  }


  // ดึงข้อมูลผู้ใช้ทั้งหมด
  @Get()
  async findAll(@Query() q:{q:string}): Promise<User[]> {
    return this.userService.findAllUsers(q);
  }

  // ดึงข้อมูลผู้ใช้ตาม ID
// ดึงข้อมูลผู้ใช้ตาม ID
@Get(':id')
async findOne(@Param('id') id: string): Promise<User> {
  const user = await this.userService.findOneUser(Number(id)); // ตรวจสอบว่ามีการแปลงค่า id เป็น number
  if (!user) {
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }
  return user;
}


  // อัปเดตข้อมูลผู้ใช้
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userService.updateUser(Number(id), updateUserDto);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  // ลบผู้ใช้
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<User> {
    const user = await this.userService.removeUser(Number(id));
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @Get(':id/history')
  async getUserHistory(@Param('id') userId: number) {
    return await this.userService.getUserWithHistory(userId);
  }
  
  @Put(':id/update-password')
  async updatePassword(
    @Param('id') id: string,        // รับค่า id จากพารามิเตอร์ใน URL
    @Body() updatePasswordDto: UpdatePasswordDto // รับค่า body สำหรับข้อมูลการอัพเดต password
  ) {
    return this.userService.updatePassword(parseInt(id), updatePasswordDto); // ส่ง id และ updatePasswordDto ไปยัง service
  }
  

}

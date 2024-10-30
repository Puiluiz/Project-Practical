import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ManybahtService } from '../manybaht/manybaht.service'; // บริการ Manybaht สำหรับการตรวจสอบการชำระเงิน
import { PrismaService } from 'src/utills/prisma/prisma.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, ManybahtService],
})
export class UserModule {}
